// Get all the keys from document
var keys = document.querySelectorAll('#calculator span');

setDefaultArguments();

// Add onclick event to all the keys and perform operations
for(var i = 0; i < keys.length; i++) {
    keys[i].onclick = function(e) {
        let btnVal = this.innerHTML;
        let arguments = new Arguments();
        let resultElementsRDL = new ResultElementsRDL();
        let resultElementsCuenca = new ResultElementsCuenca();
        if(btnVal == 'Borrar') {
            clearArguments(arguments);
            clearResults(resultElementsRDL);
            clearResults(resultElementsCuenca);
        } else if(btnVal == 'Calcular') {
            if(arguments.haveAllArgumentsValue) {
                let calculatorRDL = new CalculatorRDL(arguments);
                let showResultsRDL = new ShowResults(calculatorRDL, resultElementsRDL);
                showResultsRDL.showResults();
                let calculatorCuenca = new CalculatorCuenca(arguments);
                let showResultsCuenca = new ShowResults(calculatorCuenca, resultElementsCuenca);
                showResultsCuenca.showResults();
            }
        }    
    } 
}

function setDefaultArguments() {
	setValue(document.querySelector('#valorCatastral'), 20000);
	setValue(document.querySelector('#porcentajeAnual'), 3.5);
	setValue(document.querySelector('#añosPropiedad'), 10);
}

function setValue(element, value) {
	element.value = value;
}

function clearArguments(arguments) {
    function clearValue(element) {
        setValue(element, '');
    }
    clearValue(arguments.valorCatastral);
    clearValue(arguments.porcentajeAnual);
    clearValue(arguments.añosPropiedad);
}

function clearResults(resultElements) {
    function clearInnerHtml(element) {
        setInnerHTML(element, '');
    }
    clearInnerHtml(resultElements.baseImponible);
    clearInnerHtml(resultElements.plusvalia);
}

function setInnerHTML(element, value) {
    element.innerHTML = value;
}

class Arguments {
  constructor(){
    this._valorCatastral = document.querySelector('#valorCatastral');
    this._porcentajeAnual = document.querySelector('#porcentajeAnual');
    this._añosPropiedad = document.querySelector('#añosPropiedad');
  }

    get valorCatastral() {
        return this._valorCatastral;
    }

    get porcentajeAnual() {
        return this._porcentajeAnual;
    }

    get añosPropiedad() {
        return this._añosPropiedad;
    }

    get haveAllArgumentsValue() {
        return !(
            isNaN(this.valorCatastralValue)
            && isNaN(this.porcentajeAnualValue)
            && isNaN(this.añosPropiedadValue)
        )
    }

    get valorCatastralValue() {
        return this._elementValueAsNumber(this._valorCatastral);
    }

    get porcentajeAnualValue() {
        return this._elementValueAsNumber(this._porcentajeAnual) / 100;
    }

    get añosPropiedadValue() {
        return this._elementValueAsNumber(this._añosPropiedad);
    }

    _elementValueAsNumber(element) {
        return element.valueAsNumber;
    }
}

class ResultElements {
    constructor (baseImponible, plusvalia) {
        this._baseImponible = baseImponible;
        this._plusvalia = plusvalia;
    }

    get baseImponible() {
        return this._baseImponible;
    }

    get plusvalia() {
        return this._plusvalia;
    }
}

class ResultElementsRDL extends ResultElements {
    constructor() {
        super(
            document.querySelector('#baseImponibleRDL'),
            document.querySelector('#plusvaliaRDL')
        )
    }
}
 
class ResultElementsCuenca extends ResultElements {
    constructor() {
        super(
            document.querySelector('#baseImponibleCuenca'),
            document.querySelector('#plusvaliaCuenca')
        )
    }
}


class ShowResults {
    constructor (calculator, htmlElements) {
        this._calculator = calculator;
        this._htmlElements = htmlElements;
    }

    showResults() {
        this._showBaseImponible();
        this._showPlusvalia();
    }

    _showBaseImponible() {
        setInnerHTML(this._htmlElements.baseImponible, this._calculator.baseImponible);
    }
    
    _showPlusvalia() {
        setInnerHTML(this._htmlElements.plusvalia, this._calculator.plusvalia);
    }
}

class Calculator {
  constructor(args){
    this._arguments = args;
  }

  get baseImponible() {
    return (this._arguments.valorCatastralValue * ((this._arguments.porcentajeAnualValue) * this._arguments.añosPropiedadValue)).toFixed(2);
  }

  get plusvalia() {
    return (this.baseImponible * 30 / 100).toFixed(2)
  }
}

class CalculatorRDL extends Calculator {}

class CalculatorCuenca extends Calculator {
  get baseImponible() {
    return (super.baseImponible / (1 + (this._arguments.porcentajeAnualValue * this._arguments.añosPropiedadValue))).toFixed(2);
  }
}