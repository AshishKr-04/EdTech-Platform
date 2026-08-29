import express from "express";
const router = express.Router();
import Stripe from "stripe";

import Course from "../models/Course.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/auth.js";
import AppError from "../middleware/AppError.js";
import { validateIdParam } from "../middleware/validate.js";

// Initialize Stripe if key is present
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ================= CREATE CHECKOUT SESSION (REAL OR DEMO) =================
router.post("/create-checkout-session", authMiddleware, async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return next(new AppError("courseId is required", 400));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Prevent duplicate enrollment
    if (user.enrolledCourses.includes(courseId)) {
      return next(new AppError("You are already enrolled in this course!", 400));
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // --- STRIPE MODE ---
    if (stripe) {
      console.log("Stripe Key detected. Initiating real Stripe Checkout Session.");

      // 1. Create a pending Order in DB
      const order = new Order({
        user: req.user.id,
        course: courseId,
        amount: course.price,
        status: "pending",
        paymentMethod: "stripe",
      });
      await order.save();

      // 2. Build Stripe session details
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: course.title,
                description: course.description.substring(0, 100) + "...",
              },
              unit_amount: course.price * 100, // Amount in cents/paise
            },
            quantity: 1,
          },
        ],
        success_url: `${clientUrl}/my-courses?success=true&courseId=${courseId}`,
        cancel_url: `${clientUrl}/course/${courseId}?canceled=true`,
        metadata: {
          orderId: order._id.toString(),
          userId: req.user.id,
          courseId: courseId,
        },
      });

      // 3. Update Order with Stripe Session ID
      order.stripeSessionId = session.id;
      await order.save();

      return res.json({ url: session.url });
    }

    // --- DEMO CHECKOUT SIMULATOR MODE ---
    console.log("No Stripe Key detected. Running in Demo Checkout Mode.");

    const order = new Order({
      user: req.user.id,
      course: courseId,
      amount: course.price,
      status: "pending",
      paymentMethod: "demo",
    });
    await order.save();

    // Redirect user to the visual Demo Billing screen in the client
    const demoRedirectUrl = `/demo-checkout/${order._id}`;
    res.json({ url: demoRedirectUrl, isDemo: true });
  } catch (err) {
    next(err);
  }
});

// ================= GET ORDER DETAILS =================
router.get("/orders/:orderId", authMiddleware, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("course", "title price description");

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (order.user.toString() !== req.user.id) {
      return next(new AppError("Unauthorized order access", 403));
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// ================= DEMO PAYMENT COMPLETE SIMULATOR =================
router.post("/demo-complete", authMiddleware, async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return next(new AppError("orderId is required", 400));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (order.user.toString() !== req.user.id) {
      return next(new AppError("Unauthorized order completion", 403));
    }

    if (order.status === "completed") {
      return res.json({ success: true, message: "Order already completed" });
    }

    // 1. Mark order as completed
    order.status = "completed";
    await order.save();

    // 2. Enroll the student in the course
    const user = await User.findById(req.user.id);
    if (!user.enrolledCourses.includes(order.course)) {
      user.enrolledCourses.push(order.course);
      await user.save();

      // Increment studentsCount
      await Course.findByIdAndUpdate(order.course, { $inc: { studentsCount: 1 } });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ================= STRIPE WEBHOOK LISTENER =================
// Requires raw parser body in server.js, but since Express JSON parser is used globally,
// we parse using native request parsing or configure standard webhook constructor.
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    if (!stripe) {
      return res.status(400).send("Stripe webhook is inactive (Missing API Key)");
    }

    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Signature Verification Failed ❌", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle transaction success event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { orderId, userId, courseId } = session.metadata;

    console.log("Stripe Webhook checkout completed! Processing enrollment...");

    try {
      // 1. Update Order
      const order = await Order.findById(orderId);
      if (order) {
        order.status = "completed";
        await order.save();
      }

      // 2. Enroll User
      const user = await User.findById(userId);
      if (user && !user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();

        // Increment studentsCount
        await Course.findByIdAndUpdate(courseId, { $inc: { studentsCount: 1 } });
      }

      console.log(`Enrollment completed successfully for User ${userId} inside Course ${courseId} ✅`);
    } catch (err) {
      console.error("Error processing Stripe Webhook order:", err);
      return res.status(500).send("Error saving transaction data");
    }
  }

  res.json({ received: true });
});

export default router;
