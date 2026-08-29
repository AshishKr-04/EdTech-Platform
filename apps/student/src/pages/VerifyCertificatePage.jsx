import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { 
  ShieldCheck, 
  Award, 
  Calendar, 
  Clock, 
  Layers, 
  ArrowLeft,
  Loader2,
  FileCheck
} from "lucide-react";
import { motion } from "framer-motion";

const VerifyCertificatePage = () => {
  const { certId } = useParams();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/verify-certificate/${certId}`);
        if (res.data.success) {
          setCertData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Invalid certificate credential ID.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certId]);

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
      {/* Subtle glowing backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-3xl w-full z-10 space-y-6">
        
        {/* Back Link */}
        <div className="text-left">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to EduMind</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-[#0d1222]/80 border border-slate-800 rounded-3xl p-20 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium">Validating cryptographic credential...</p>
          </div>
        ) : error ? (
          <div className="bg-[#0d1222]/80 border border-red-950 rounded-3xl p-12 text-center shadow-2xl backdrop-blur-md space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-950/30 border border-red-900 rounded-full flex items-center justify-center text-red-500">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Verification Failed</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                {error} Recruiters or auditors should double check the certificate identifier code.
              </p>
            </div>
            <Link 
              to="/courses"
              className="inline-flex bg-slate-900 border border-slate-800 hover:bg-slate-850 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition shadow-md"
            >
              Explore Valid Courses
            </Link>
          </div>
        ) : (
          /* ================= VERIFIED CERTIFICATE CARD ================= */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d1222]/90 border-2 border-indigo-950/60 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-950/20 backdrop-blur-md relative"
          >
            
            {/* Verification Stamp Top Header */}
            <div className="bg-emerald-500/10 border-b border-emerald-900/30 px-6 py-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Verifiable Credentials Secured</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">ID: {certId}</span>
            </div>

            {/* Certificate Template Body */}
            <div className="p-8 sm:p-12 text-center space-y-8 relative">
              
              {/* Subtle watermark in background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                <Award className="w-[400px] h-[400px]" />
              </div>

              {/* Award Header */}
              <div className="space-y-3">
                <div className="mx-auto w-20 h-20 bg-indigo-950/40 border border-indigo-900/50 rounded-full flex items-center justify-center text-indigo-400">
                  <Award className="h-10 w-10" />
                </div>
                <h3 className="text-indigo-400 font-extrabold uppercase tracking-widest text-sm">Certificate of Graduation</h3>
              </div>

              {/* Student Name */}
              <div className="space-y-2">
                <p className="text-slate-400 text-sm italic font-serif">This is proudly awarded to</p>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight border-b-2 border-slate-800 pb-4 max-w-lg mx-auto">
                  {certData.studentName}
                </h1>
              </div>

              {/* Completion Statement */}
              <div className="space-y-2">
                <p className="text-slate-350 text-sm max-w-lg mx-auto leading-relaxed">
                  for successfully finishing and mastering all curriculum requirements for the premium online course
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-indigo-300 mt-2">
                  {certData.courseTitle}
                </h2>
              </div>

              {/* Course Meta Info */}
              <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-800/60 py-4 max-w-xl mx-auto text-left">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Duration</p>
                    <p className="text-xs font-bold text-slate-200">{certData.courseDuration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Category</p>
                    <p className="text-xs font-bold text-slate-200">{certData.courseCategory}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Graduated</p>
                    <p className="text-xs font-bold text-slate-200">
                      {new Date(certData.issuedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verifiable Hash Stamp Footer */}
              <div className="pt-6 border-t border-slate-850 max-w-xl mx-auto space-y-3">
                <div className="bg-[#070913]/60 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-left">
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Cryptographic Verification Stamp</p>
                    <p className="text-[11px] text-slate-400 font-mono break-all mt-1">{certData.hash}</p>
                  </div>
                  <FileCheck className="h-8 w-8 text-emerald-500 flex-shrink-0 ml-3" />
                </div>
                <p className="text-[10px] text-slate-500 text-center">
                  This credential represents a secure, database-verifiable online learning achievement.
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificatePage;
