function parseCompound(cmpd) {
  const elmts = {};
  let i = 0;
  let coef = "";

  while (i < cmpd.length) {
    if (cmpd[i].match(/[0-9]/)) {
      coef += cmpd[i];
      i++;
      continue;
    }
    break;
  }

  coef = coef || "1";
  const multpr = parseInt(coef);

  while (i < cmpd.length) {
    if (cmpd[i].match(/[A-Z]/)) {
      let elmt = cmpd[i];
      i++;

      while (i < cmpd.length && cmpd[i].match(/[a-z]/)) {
        elmt += cmpd[i];
        i++;
      }

      let cnt = "";
      while (i < cmpd.length && cmpd[i].match(/[0-9]/)) {
        cnt += cmpd[i];
        i++;
      }

      cnt = cnt || "1";
      elmts[elmt] =
        (elmts[elmt] || 0) + parseInt(cnt) * multpr;
    } else {
      i++;
    }
  }
  return elmts;
}

function parseEquation(eqn) {
  const [rcts, prdts] = eqn.split("->").map((x) =>
    x
      .trim()
      .split("+")
      .map((cmpd) => cmpd.trim())
  );

  const lelmts = {};
  const relmts = {};

  rcts.forEach((cmpd) => {
    const elmts = parseCompound(cmpd);
    Object.entries(elmts).forEach(([elmt, cnt]) => {
      lelmts[elmt] = (lelmts[elmt] || 0) + cnt;
    });
  });

  prdts.forEach((cmpd) => {
    const elmts = parseCompound(cmpd);
    Object.entries(elmts).forEach(([elmt, cnt]) => {
      relmts[elmt] = (relmts[elmt] || 0) + cnt;
    });
  });
  return { lelmts, relmts };
}

function balanceEquation(eqn) {
  // Basic validation
  if (!eqn.includes("->")) {
    throw new Error("Invalid eqn format. Must contain ->");
  }

  const { lelmts, relmts } = parseEquation(eqn);

  // Check if elmts match on both xs
  const alelmts = new Set([
    ...Object.keys(lelmts),
    ...Object.keys(relmts),
  ]);

  for (const elmt of alelmts) {
    if (!lelmts[elmt] || !relmts[elmt]) {
      throw new Error(`Elmt ${elmt} is not present on both xs`);
    }

    if (lelmts[elmt] !== relmts[elmt]) {
      throw new Error("Eqn cannot be balanced with simple integer coefs");
    }
  }

  // If we reach here, the eqn is already balanced
  return eqn;
}

module.exports = { balanceEquation, parseCompound, parseEquation };