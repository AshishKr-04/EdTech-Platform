import React from 'react';

const AboutPage = () => {
  const stats = [
    { label: 'Active Students', value: '10K+' },
    { label: 'Expert Instructors', value: '500+' },
    { label: 'Premium Courses', value: '1.2K+' },
    { label: 'Success Stories', value: '5K+' },
  ];

  return (
    <div className="bg-white">
      {/* --- Hero Section --- */}
      <section className="bg-indigo-700 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Empowering Minds Through Digital Learning</h1>
        <p className="text-xl max-w-2xl mx-auto text-indigo-100">
          EduMind is more than just a platform; it's a global community of learners and creators dedicated to sharing knowledge and building the future.
        </p>
      </section>

      {/* --- Stats Section --- */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Mission & Vision Section --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our mission is to democratize education. We believe that high-quality learning should be accessible to everyone, regardless of their location or background. By connecting industry experts with passionate learners, we close the skills gap and empower individuals to achieve their professional dreams.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We leverage the latest MERN technology to provide a seamless, secure, and interactive environment for digital education.
            </p>
          </div>
          
          {/* --- 👇 UPDATED IMAGE CONTAINER WITH CORRECT PATH --- */}
          <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative group">
              <img 
                src="/images/about-vision.jpg" 
                alt="Visionary Classroom" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle indigo overlay on hover */}
              <div className="absolute inset-0 bg-indigo-900 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          </div>
        </div>
      </section>

      {/* --- Core Values Section --- */}
      <section className="bg-gray-900 text-white py-20 px-4 rounded-[3rem] mx-4 mb-10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-700 rounded-xl hover:border-indigo-500 transition-colors">
              <h3 className="text-xl font-bold mb-3">Innovation First</h3>
              <p className="text-gray-400">We constantly improve our platform to provide the best user experience using modern tech stacks like MERN.</p>
            </div>
            <div className="p-6 border border-gray-700 rounded-xl hover:border-indigo-500 transition-colors">
              <h3 className="text-xl font-bold mb-3">Student Success</h3>
              <p className="text-gray-400">Your growth is our metric. We build features that help students track progress and stay motivated.</p>
            </div>
            <div className="p-6 border border-gray-700 rounded-xl hover:border-indigo-500 transition-colors">
              <h3 className="text-xl font-bold mb-3">Community Growth</h3>
              <p className="text-gray-400">We foster a supportive environment where instructors and students can interact and grow together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Call to Action Section --- */}
      <section className="py-20 text-center container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to start your journey?</h2>
        <div className="flex justify-center space-x-4">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg">Explore Courses</button>
          <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition">Join as Instructor</button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;