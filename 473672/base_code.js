function calculateMolarMass(f) {
  var atmas = {
    H: 1,
    He: 4,
    Li: 7,
    Be: 9,
    B: 11,
    C: 12,
    N: 14,
    O: 16,
    F: 19,
    Ne: 20,
    Na: 23,
    Mg: 24,
    Al: 27,
    Si: 28,
    P: 31,
    S: 32,
    Cl: 35,
    Ar: 40,
    K: 39,
    Ca: 40,
    Fe: 56,
    Cu: 64,
    Zn: 65,
    Ag: 108,
    Au: 197,
  };

  if (!f || typeof f !== "string") {
    throw new Error("Invalid f: F must be a non-empty string");
  }

  function psF(f, sI = 0) {
    var m = 0;
    var i = sI;

    while (i < f.length) {
      if (f[i] === "(") {
        var pc = 1;
        var j = i + 1;

        if (j >= f.length || f[j] === ")" || !/[A-Z(]/.test(f[j])) {
          throw new Error("Invalid f: Empty or invalid group");
        }

        while (j < f.length && pc > 0) {
          if (f[j] === "(") pc++;
          if (f[j] === ")") pc--;
          j++;
        }
        if (pc !== 0) {
          throw new Error("Invalid f: Unmatched parentheses");
        }
        var sbMas = psF(f.slice(i + 1, j - 1));
        var nstr = "";
        while (j < f.length && /[0-9]/.test(f[j])) {
          nstr += f[j];
          j++;
        }
        var mtpl = nstr ? parseInt(nstr) : 1;
        m += sbMas * mtpl;
        i = j;
      } else if (/[A-Z]/.test(f[i])) {
        var emnt = f[i];
        if (i + 1 < f.length && /[a-z]/.test(f[i + 1])) {
          emnt += f[i + 1];
          i++;
        }
        if (!atmas[emnt]) {
          throw new Error(`Invalid f: Unknown emnt ${emnt}`);
        }
        var nstr = "";
        i++;
        while (i < f.length && /[0-9]/.test(f[i])) {
          nstr += f[i];
          i++;
        }
        var cnt = nstr ? parseInt(nstr) : 1;
        m += atmas[emnt] * cnt;
      } else {
        throw new Error("Invalid f: Unexpected character");
      }
    }
    return m;
  }

  return psF(f);
}

module.exports = { calculateMolarMass };