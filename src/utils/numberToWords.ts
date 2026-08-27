/**
 * Convert number in VND to standard Vietnamese words
 * Example: 1005000 -> "Một triệu không trăm lẻ năm nghìn đồng chẵn."
 * Example: 25010000 -> "Hai mươi lăm triệu không trăm mười nghìn đồng chẵn."
 */
export function readVNDInWords(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return "Không đồng chẵn.";

  const defaultNumbers = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  const readThreeDigits = (n: number, isFirstGroup: boolean): string => {
    const hundreds = Math.floor(n / 100);
    const tens = Math.floor((n % 100) / 10);
    const ones = n % 10;
    let result = "";

    // Hundreds digit
    if (hundreds > 0 || !isFirstGroup) {
      result += defaultNumbers[hundreds] + " trăm ";
    }

    // Tens digit
    if (tens > 1) {
      result += defaultNumbers[tens] + " mươi ";
      if (ones === 1) {
        result += "mốt";
      } else if (ones === 5) {
        result += "lăm";
      } else if (ones > 0) {
        result += defaultNumbers[ones];
      }
    } else if (tens === 1) {
      result += "mười ";
      if (ones === 5) {
        result += "lăm";
      } else if (ones > 0) {
        result += defaultNumbers[ones];
      }
    } else {
      // tens === 0
      if (ones > 0) {
        if (hundreds > 0 || !isFirstGroup) {
          result += "lẻ " + defaultNumbers[ones];
        } else {
          result += defaultNumbers[ones];
        }
      }
    }

    return result.trim();
  };

  let numStr = Math.round(amount).toString();
  const groups: string[] = [];
  while (numStr.length > 0) {
    groups.unshift(numStr.slice(Math.max(0, numStr.length - 3)));
    numStr = numStr.slice(0, Math.max(0, numStr.length - 3));
  }

  let words = "";
  for (let i = 0; i < groups.length; i++) {
    const groupNum = parseInt(groups[i], 10);
    if (groupNum > 0) {
      const isFirstGroup = i === 0;
      const groupWords = readThreeDigits(groupNum, isFirstGroup);
      const unit = units[groups.length - 1 - i];
      words += (groupWords + (unit ? " " + unit : "")).trim() + " ";
    }
  }

  words = words.trim();
  if (!words) return "Không đồng chẵn.";
  return words.charAt(0).toUpperCase() + words.slice(1) + " đồng chẵn.";
}
