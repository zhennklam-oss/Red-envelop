/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Heart, Sparkles, Image as ImageIcon, Loader2, AlertCircle, Music } from 'lucide-react';

const ADMIN_KEY = "creator_secret_123";

export default function App() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [animationStage, setAnimationStage] = useState<'initial' | 'pause' | 'expand' | 'explode'>('initial');
  const [fragments, setFragments] = useState<Array<{ x: number; y: number; rotation: number }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const isCreator = searchParams.get('key') === ADMIN_KEY;

  useEffect(() => {
    fetchData();
    fetchServerInfo();
  }, []);

  const fetchServerInfo = async () => {
    try {
      const res = await fetch('/api/server-info');
      const data = await res.json();
      setShareUrl(data.shareUrl);
    } catch (err) {
      console.error("Failed to fetch server info:", err);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/image');
      const data = await res.json();
      if (data.image) setPhoto(data.image);
      if (data.music) setMusic(data.music);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await saveData(reader.result as string, music);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|ogg|webm)$/i)) {
        alert('请上传音频文件（支持 WAV、MP3、OGG、WEBM 格式）');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        await saveData(photo, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveData = async (imageData: string | null, musicData: string | null) => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData || photo,
          music: musicData || music,
          key: ADMIN_KEY
        })
      });

      if (res.ok) {
        if (imageData) setPhoto(imageData);
        if (musicData) setMusic(musicData);
        setIsOpen(false);
      } else {
        const data = await res.json();
        alert(data.error || "保存失败");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("保存时发生错误");
    } finally {
      setIsSaving(false);
    }
  };

  const reset = async () => {
    if (confirm("确定要删除当前内容吗？")) {
      await saveData("", "");
      setPhoto(null);
      setMusic(null);
    }
  };

  const toggleEnvelope = () => {
    if (photo && !isOpen) {
      setIsOpen(true);
      setAnimationStage('initial');

      if (music && audioRef.current) {
        audioRef.current.play().catch(err => console.error("音乐播放失败:", err));
      }

      // 动画序列：停留3秒 -> 放大2秒 -> 爆炸
      setTimeout(() => setAnimationStage('pause'), 100);
      setTimeout(() => setAnimationStage('expand'), 3100);
      setTimeout(() => {
        setAnimationStage('explode');
        // 生成碎片
        const newFragments = Array.from({ length: 20 }, () => ({
          x: (Math.random() - 0.5) * 800,
          y: (Math.random() - 0.5) * 800,
          rotation: Math.random() * 720
        }));
        setFragments(newFragments);
      }, 5100);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6321] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FF6321] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37] blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {/* Creator Setup View */}
        {isCreator && (!photo || isSaving) ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-black/5 z-10"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-[#FF6321]/10 rounded-full flex items-center justify-center">
                {isSaving ? <Loader2 className="w-10 h-10 text-[#FF6321] animate-spin" /> : <ImageIcon className="w-10 h-10 text-[#FF6321]" />}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {isSaving ? "正在保存..." : "设置你的红包惊喜"}
            </h1>
            <p className="text-gray-500 mb-8">作为制作者，请上传照片和音乐。分享链接后，其他人将只能看到红包并开启它。</p>

            <div className="space-y-4">
              <button
                disabled={isSaving}
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[#FF6321] hover:bg-[#E5591E] disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF6321]/20"
              >
                <Upload className="w-5 h-5" />
                选择并上传照片
              </button>

              <button
                disabled={isSaving}
                onClick={() => musicInputRef.current?.click()}
                className="w-full bg-[#D4AF37] hover:bg-[#B8860B] disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
              >
                <Music className="w-5 h-5" />
                {music ? "更换背景音乐" : "上传背景音乐（可选）"}
              </button>
            </div>
          </motion.div>
        ) : photo ? (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Red Envelope Container */}
            <div className="relative w-72 h-96 cursor-pointer group" onClick={toggleEnvelope}>
              {/* Envelope Body */}
              <motion.div
                className="absolute inset-0 bg-[#D82E2E] rounded-2xl shadow-2xl flex flex-col items-center justify-between py-12 overflow-hidden border-2 border-[#B22222]"
                animate={isOpen ? { y: 100, opacity: 0.5, scale: 0.95 } : { y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                {/* Decorative Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute inset-0 border-[16px] border-white/20 m-4 rounded-lg" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white/30 rounded-full flex items-center justify-center">
                    <Sparkles className="w-20 h-20 text-white" />
                  </div>
                </div>

                <div className="z-10 text-center">
                  <h2 className="text-white text-4xl font-serif italic font-bold tracking-widest">福</h2>
                  <p className="text-[#FFD700] text-sm mt-2 font-medium tracking-widest uppercase opacity-80">Gifts of Joy</p>
                </div>

                {/* The Seal Button */}
                {!isOpen && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="z-20 w-20 h-20 bg-[#FFD700] rounded-full shadow-lg flex items-center justify-center border-4 border-[#B8860B]"
                  >
                    <span className="text-[#D82E2E] text-2xl font-bold">開</span>
                  </motion.div>
                )}

                {/* BOOM Text */}
                {animationStage === 'explode' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center z-40"
                  >
                    <h1 className="text-8xl font-black text-[#FFD700] drop-shadow-2xl">BOOM!</h1>
                  </motion.div>
                )}

                <div className="z-10 text-[#FFD700]/60 text-xs font-mono">2026 PROSPERITY</div>
              </motion.div>

              {/* The Photo (Before Explosion) */}
              <AnimatePresence>
                {isOpen && animationStage !== 'explode' && (
                  <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.5 }}
                    animate={
                      animationStage === 'initial' || animationStage === 'pause'
                        ? { y: -50, opacity: 1, scale: 1.1 }
                        : { scale: 5, opacity: 1 }
                    }
                    transition={
                      animationStage === 'expand'
                        ? { duration: 2, ease: "easeInOut" }
                        : { type: "spring", stiffness: 100, damping: 20 }
                    }
                    className="absolute inset-0 flex items-center justify-center z-30"
                  >
                    <div className="relative p-2 bg-white rounded-xl shadow-2xl rotate-3">
                      <img
                        src={photo}
                        alt="Surprise"
                        className="w-64 h-80 object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-4 -right-4 bg-[#FF6321] text-white p-2 rounded-full shadow-lg"
                      >
                        <Heart className="w-6 h-6 fill-current" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Explosion Fragments */}
              {animationStage === 'explode' && fragments.map((frag, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 z-20"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: frag.x,
                    y: frag.y,
                    opacity: 0,
                    scale: 0.3,
                    rotate: frag.rotation
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="w-12 h-12 bg-white rounded shadow-lg overflow-hidden">
                    <img
                      src={photo!}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: `${(i % 5) * 25}% ${Math.floor(i / 5) * 25}%`
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Creator Controls */}
            {isCreator && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 flex flex-col items-center gap-4"
              >
                <div className="flex gap-4">
                  <button
                    onClick={reset}
                    className="px-6 py-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    更换内容
                  </button>
                  <button
                    onClick={() => musicInputRef.current?.click()}
                    className="px-6 py-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Music className="w-4 h-4" />
                    {music ? "更换音乐" : "添加音乐"}
                  </button>
                  <button
                    onClick={() => {
                      const publicUrl = shareUrl || window.location.origin;
                      navigator.clipboard.writeText(publicUrl);
                      alert(`分享链接已复制到剪贴板！\n\n${publicUrl}\n\n发送给好友即可打开红包。`);
                    }}
                    className="px-6 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    复制分享链接
                  </button>
                </div>
                <p className="text-xs text-gray-400 italic">当前处于制作者模式</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center z-10"
          >
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-500">惊喜正在准备中...</h2>
            <p className="text-gray-400 mt-2">请稍后再来看看吧</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#FFD700]/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hidden Audio Element */}
      {music && <audio ref={audioRef} src={music} loop />}

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={musicInputRef}
        onChange={handleMusicChange}
        accept="audio/*,.wav,.mp3,.ogg,.webm"
        className="hidden"
      />
    </div>
  );
}
