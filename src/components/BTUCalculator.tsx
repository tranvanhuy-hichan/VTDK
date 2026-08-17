"use client";

import React, { useState, useEffect } from "react";
import { Calculator, ArrowRight, AlertCircle } from "lucide-react";

type CalcMode = "area" | "volume";
type RoomType = "bedroom" | "living" | "office" | "restaurant";

interface PipeRecommendation {
  liquid: string;
  gas: string;
  insulation: string;
}

export const BTUCalculatorBox: React.FC = () => {
  const [calcMode, setCalcMode] = useState<CalcMode>("area");
  const [sizeValue, setSizeValue] = useState<number>(15); // Default to 15 m2
  const [roomType, setRoomType] = useState<RoomType>("bedroom");

  const [btuResult, setBtuResult] = useState<number>(9000);
  const [hpResult, setHpResult] = useState<string>("1.0 HP");
  const [pipeRec, setPipeRec] = useState<PipeRecommendation>({
    liquid: "6.35 mm",
    gas: "9.52 mm",
    insulation: "Ống đơn dày 10mm - 19mm"
  });

  const roomTypes = [
    { id: "bedroom", label: "Phòng Ngủ", factorArea: 600, factorVolume: 200, desc: "Ít tỏa nhiệt, yêu cầu yên tĩnh." },
    { id: "living", label: "Phòng Khách", factorArea: 700, factorVolume: 230, desc: "Tỏa nhiệt trung bình, đông người." },
    { id: "office", label: "Văn Phòng", factorArea: 800, factorVolume: 270, desc: "Nhiều máy móc thiết bị vận hành." },
    { id: "restaurant", label: "Nhà Hàng / Cafe", factorArea: 1000, factorVolume: 330, desc: "Mật độ người cao, tỏa nhiệt lớn." },
  ];

  // Adjust default size when switching modes
  useEffect(() => {
    if (calcMode === "area") {
      setSizeValue(15); // Default area: 15 m2
    } else {
      setSizeValue(45); // Default volume: 45 m3
    }
  }, [calcMode]);

  // Recalculate BTU and recommend pipe
  useEffect(() => {
    const selectedType = roomTypes.find((t) => t.id === roomType);
    if (!selectedType) return;

    let btu = 9000;
    if (calcMode === "area") {
      btu = sizeValue * selectedType.factorArea;
    } else {
      btu = sizeValue * selectedType.factorVolume;
    }

    setBtuResult(Math.round(btu));

    // Determine HP and Pipe specs based on calculated BTU
    if (btu <= 9500) {
      setHpResult("1.0 HP (9.000 BTU)");
      setPipeRec({
        liquid: "6.35 mm (1/4\")",
        gas: "9.52 mm (3/8\")",
        insulation: "Bảo ôn gen đôi hoặc đơn cuộn sẵn"
      });
    } else if (btu <= 12500) {
      setHpResult("1.5 HP (12.000 BTU)");
      setPipeRec({
        liquid: "6.35 mm (1/4\")",
        gas: "12.7 mm (1/2\")",
        insulation: "Bảo ôn gen đơn dày từ 10mm"
      });
    } else if (btu <= 18500) {
      setHpResult("2.0 HP (18.000 BTU)");
      setPipeRec({
        liquid: "6.35 mm (1/4\")",
        gas: "12.7 mm (1/2\") hoặc 15.88 mm (5/8\")",
        insulation: "Bảo ôn gen đơn Superlon tiêu chuẩn"
      });
    } else if (btu <= 24500) {
      setHpResult("2.5 HP (24.000 BTU)");
      setPipeRec({
        liquid: "6.35 mm (1/4\") hoặc 9.52 mm (3/8\")",
        gas: "15.88 mm (5/8\")",
        insulation: "Gen đơn dày cách nhiệt hệ thống lạnh"
      });
    } else {
      setHpResult(">= 3.0 HP / Hệ trung tâm Multi / VRV");
      setPipeRec({
        liquid: "Tùy thuộc bản vẽ thiết kế",
        gas: "Tùy thuộc bản vẽ thiết kế",
        insulation: "Liên hệ kỹ thuật Đông Kha để khảo sát tính toán"
      });
    }
  }, [calcMode, sizeValue, roomType]);

  const activeTypeInfo = roomTypes.find((t) => t.id === roomType);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 items-stretch">

      {/* Left Column: Inputs (7 cols) */}
      <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between text-left">
        <div>
          {/* Calculator Mode Selection */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setCalcMode("area")}
              className={`!min-h-0 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all border flex-1 ${
                calcMode === "area"
                  ? "bg-[#075FA8] border-[#075FA8] text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tính theo diện tích (m²)
            </button>
            <button
              onClick={() => setCalcMode("volume")}
              className={`!min-h-0 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all border flex-1 ${
                calcMode === "volume"
                  ? "bg-[#075FA8] border-[#075FA8] text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tính theo thể tích (m³)
            </button>
          </div>

          {/* Slider for value */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-700">
                {calcMode === "area" ? "Diện tích phòng" : "Thể tích phòng"}
              </span>
              <span className="text-lg font-black text-[#075FA8] bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-lg">
                {sizeValue} {calcMode === "area" ? "m²" : "m³"}
              </span>
            </div>
            <input
              type="range"
              min={calcMode === "area" ? 10 : 30}
              max={calcMode === "area" ? 80 : 240}
              step={1}
              value={sizeValue}
              onChange={(e) => setSizeValue(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#075FA8]"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
              <span>{calcMode === "area" ? "10 m²" : "30 m³"}</span>
              <span>{calcMode === "area" ? "80 m²" : "240 m³"}</span>
            </div>
          </div>

          {/* Room type selection */}
          <div>
            <span className="text-sm font-bold text-slate-700 block mb-2">
              Không gian sử dụng phòng
            </span>
            <div className="flex flex-wrap gap-2">
              {roomTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setRoomType(type.id as RoomType)}
                  className={`!min-h-0 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg border transition-all ${
                    roomType === type.id
                      ? "bg-[#075FA8] border-[#075FA8] text-white"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTypeInfo && (
          <div className="mt-4 p-3 bg-blue-50/60 border border-blue-100/70 rounded-lg flex items-start gap-2 text-xs text-slate-600">
            <AlertCircle className="w-4 h-4 text-[#075FA8] shrink-0 mt-0.5" />
            <span>
              {activeTypeInfo.desc} Hệ số áp dụng: <strong>{calcMode === "area" ? activeTypeInfo.factorArea : activeTypeInfo.factorVolume} BTU</strong> trên mỗi {calcMode === "area" ? "m²" : "m³"}.
            </span>
          </div>
        )}
      </div>

      {/* Right Column: Results & Technical Recommendation (5 cols) */}
      <div className="md:col-span-5 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between text-left relative">
        <div>
          <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Calculator className="w-4 h-4" />
            Kết quả tính toán
          </div>

          {/* Tonnage / HP Result */}
          <div className="mb-6">
            <span className="text-xs text-slate-400 block mb-1">
              Công suất máy lạnh khuyên dùng
            </span>
            <span className="text-xl sm:text-2xl font-black text-white block tracking-tight">
              {hpResult}
            </span>
            <span className="text-sm text-slate-400 block mt-1">
              (Nhu cầu ước tính: ~{btuResult.toLocaleString()} BTU/h)
            </span>
          </div>

          {/* Recommended Pipe Spec */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-1">
              Quy cách ống đồng tiêu chuẩn
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Ống lỏng (đường đi)</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-200 leading-normal">{pipeRec.liquid}</span>
              </div>
              <div className="flex flex-col gap-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Ống hơi (đường về)</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-200 leading-normal">{pipeRec.gas}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Bảo ôn gen cách nhiệt</span>
              <span className="text-xs font-bold text-slate-200 leading-relaxed">{pipeRec.insulation}</span>
            </div>
          </div>
        </div>

        {/* Quote CTA Button */}
        <div className="mt-8">
          <a
            href="#lien-he"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#F47A20] hover:bg-[#E06912] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all"
          >
            <span>Nhận báo giá vật tư máy</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

    </div>
  );
};
