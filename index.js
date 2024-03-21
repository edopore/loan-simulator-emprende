const submitButton = document.getElementById("submit");
const loanTerm = document.querySelector("#loan-term");
const amount = document.querySelector("#amount");
const tBody = document.querySelector(".tbody");
let ColombiaPeso = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
});

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (amount.value === "" || loanTerm.value === "") {
    alert("Debe ingresar Monto del Préstamo y Cantidad de Cuotas");
    return;
  }
  if (loanTerm.value > 36) {
    alert("El plazo máximo del préstamo debe ser entre 1 y 36 meses");
    return;
  }
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }
  estimateValue(amount.value, loanTerm.value).map((obj) => {
    tBody.innerHTML += `
    <tr>
        <td>${obj.noCuota}</td>
        <td>${obj.cuota}</td>
        <td>${obj.capital}</td>
        <td>${obj.interes}</td>
        <td>${obj.monto}</td>
    </tr>
    `;
  });
});

function estimateValue(monto, plazo) {
  let amortConstant = (monto * 0.03) / (1 - Math.pow(1 + 0.03, -1 * plazo));
  let creditArr = [];
  for (let i = 0; i <= plazo; i++) {
    if (i == 0) {
      creditArr.push({
        noCuota: i,
        cuota: ColombiaPeso.format(0),
        capital: ColombiaPeso.format(0),
        interes: ColombiaPeso.format(0),
        monto: ColombiaPeso.format(monto),
      });
      continue;
    }
    const intereses = monto * 0.03;
    const amortizacion = amortConstant - intereses;
    monto = monto - amortizacion;
    creditArr.push({
      noCuota: i,
      cuota: ColombiaPeso.format(amortConstant.toFixed(0)),
      capital: ColombiaPeso.format((amortConstant - intereses).toFixed(0)),
      interes: ColombiaPeso.format(intereses.toFixed(0)),
      monto: ColombiaPeso.format(monto.toFixed(0)),
    });
  }
  return creditArr;
}
