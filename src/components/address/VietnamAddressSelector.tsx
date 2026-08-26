"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Home } from "lucide-react";
import { SearchableAddressSelect } from "./SearchableAddressSelect";
import {
  fetchProvinces,
  fetchWardsByProvince,
  type ProvinceItem,
  type WardUnitItem,
} from "../../lib/vietnamProvinces";

export interface AddressDetailData {
  province: string;
  provinceCode: string;
  ward: string;
  wardCode?: string;
  street: string;
  fullAddress: string;
}

interface VietnamAddressSelectorProps {
  initialAddress?: string;
  onChange: (fullAddress: string, detail?: AddressDetailData) => void;
  required?: boolean;
}

export const VietnamAddressSelector: React.FC<VietnamAddressSelectorProps> = ({
  initialAddress = "",
  onChange,
  required = true,
}) => {
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [wardUnits, setWardUnits] = useState<WardUnitItem[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("48"); // Default Đà Nẵng
  const [selectedWardCode, setSelectedWardCode] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);
  const [wardLoadError, setWardLoadError] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    let isMounted = true;
    fetchProvinces().then((data) => {
      if (isMounted) {
        setProvinces(data);
        setLoadingProvinces(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // When province changes, load 2-tier wards / administrative units
  useEffect(() => {
    let cancelled = false;

    if (!selectedProvinceCode) {
      setWardUnits([]);
      setSelectedWardCode("");
      setWardLoadError(false);
      return;
    }

    setLoadingWards(true);
    setWardLoadError(false);
    fetchWardsByProvince(selectedProvinceCode).then((units) => {
      if (cancelled) return;
      setWardUnits(units);
      setWardLoadError(units.length === 0);
      setLoadingWards(false);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedProvinceCode]);

  // Try to parse initial raw address string if provided
  useEffect(() => {
    if (!initialAddress || !initialAddress.trim() || provinces.length === 0) return;
    const raw = initialAddress.trim();
    const parts = raw.split(",").map((p) => p.trim());
    if (parts.length === 0) return;

    // Find province match from end of string
    const lastPart = parts[parts.length - 1].toLowerCase();
    const matchedProv = provinces.find(
      (p) =>
        lastPart.includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(lastPart) ||
        lastPart.replace(/^(tỉnh|thành phố|tp\.?)\s+/i, "").includes(p.name.toLowerCase().replace(/^(tỉnh|thành phố|tp\.?)\s+/i, ""))
    );

    if (matchedProv) {
      setSelectedProvinceCode(String(matchedProv.code));
    }

    if (parts.length >= 2) {
      setStreetAddress((current) => current || parts[0]);
    }
  }, [initialAddress, provinces]);

  // Match ward once wardUnits are loaded for the selected province
  useEffect(() => {
    if (!initialAddress || wardUnits.length === 0) return;
    const parts = initialAddress.split(",").map((p) => p.trim());
    if (parts.length >= 2) {
      // Typically ward is the second or middle part
      for (const part of parts.slice(1)) {
        const partLower = part.toLowerCase();
        const matchedWard = wardUnits.find(
          (w) =>
            w.name.toLowerCase() === partLower ||
            partLower.includes(w.name.toLowerCase()) ||
            w.name.toLowerCase().replace(/^(phường|xã|thị trấn|đặc khu)\s+/i, "") ===
              partLower.replace(/^(phường|xã|thị trấn|đặc khu)\s+/i, "")
        );
        if (matchedWard) {
          setSelectedWardCode(String(matchedWard.code));
          break;
        }
      }
    }
  }, [initialAddress, wardUnits]);

  // Notify parent on any change
  const notifyChange = useCallback(
    (provCode: string, wardCode: string, street: string) => {
      const provName = provinces.find((p) => String(p.code) === String(provCode))?.name || "";
      const wardObj = wardUnits.find((w) => String(w.code) === String(wardCode));
      const wardName = wardObj ? wardObj.name : "";

      const addressParts: string[] = [];
      if (street.trim()) addressParts.push(street.trim());
      if (wardName) addressParts.push(wardName);
      if (provName) addressParts.push(provName);

      const full = addressParts.join(", ");
      onChange(full, {
        province: provName,
        provinceCode: provCode,
        ward: wardName,
        wardCode,
        street: street.trim(),
        fullAddress: full,
      });
    },
    [provinces, wardUnits, onChange]
  );

  const handleProvinceChange = (newProvCode: string) => {
    setSelectedProvinceCode(newProvCode);
    setSelectedWardCode("");
    notifyChange(newProvCode, "", streetAddress);
  };

  const handleWardChange = (newWardCode: string) => {
    setSelectedWardCode(newWardCode);
    notifyChange(selectedProvinceCode, newWardCode, streetAddress);
  };

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStreet = e.target.value;
    setStreetAddress(newStreet);
    notifyChange(selectedProvinceCode, selectedWardCode, newStreet);
  };

  return (
    <div className="space-y-2 text-left">
      {/* 2 Cascading Dropdowns: Tỉnh/TP & Xã/Phường/Đặc khu (2-tier administrative divisions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* 1. Tỉnh / Thành phố */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
            Tỉnh / Thành phố {required && <span className="text-red-500">*</span>}
          </label>
          <SearchableAddressSelect
            value={selectedProvinceCode}
            options={provinces.map((province) => ({ value: String(province.code), label: province.name }))}
            onChange={handleProvinceChange}
            placeholder="Tìm Tỉnh / Thành phố..."
            loading={loadingProvinces}
            disabled={loadingProvinces}
            emptyMessage="Không tìm thấy Tỉnh / Thành phố"
          />
        </div>
        {/* 2. Xã / Phường / Đặc khu */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
            Xã / Phường / Thị trấn / Đặc khu {required && <span className="text-red-500">*</span>}
          </label>
          <SearchableAddressSelect
            value={selectedWardCode}
            options={wardUnits.map((ward) => ({ value: String(ward.code), label: ward.label }))}
            onChange={handleWardChange}
            placeholder="Tìm Xã / Phường / Đặc khu..."
            loading={loadingWards}
            disabled={!selectedProvinceCode || loadingWards || wardUnits.length === 0}
            emptyMessage={wardLoadError ? "Không tải được danh sách xã/phường" : "Không tìm thấy Xã / Phường / Đặc khu"}
          />
        </div>
      </div>
      {/* 3. Địa chỉ chi tiết (Số nhà, tên đường, thôn, xóm...) */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
          Địa chỉ cụ thể (Số nhà, tên đường, tòa nhà, thôn/xóm...) {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Home className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required={required}
            value={streetAddress}
            onChange={handleStreetChange}
            placeholder="Ví dụ: 400 Phạm Hùng, Phòng 201..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#075FA8]"
          />
        </div>
      </div>
    </div>
  );
};
