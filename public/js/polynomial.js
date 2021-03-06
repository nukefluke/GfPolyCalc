// Generated by CoffeeScript 1.10.0
var Polynomial, _visible_zeros_, result, test1, test2;

_visible_zeros_ = false;

Polynomial = (function() {
  function Polynomial(degree, field, coeff) {
    this.degree = degree != null ? degree : 0;
    this.field = field != null ? field : 2;
    this.coeff = coeff != null ? coeff : [0];
    this.coeff.length = this.degree + 1;
    this.fieldify();
  }

  Polynomial.prototype.fieldify = function() {
    var elem, i, index, len, ref;
    ref = this.coeff;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      elem = ref[index];
      if (elem) {
        elem %= this.field;
        if (elem < 0) {
          elem += this.field;
        }
      } else {
        elem = 0;
      }
      this.coeff[index] = elem;
    }
    return this;
  };

  Polynomial.prototype.normalize = function() {
    this.fieldify();
    while (this.degree) {
      if (this.coeff[this.degree]) {
        break;
      }
      this.degree--;
      this.coeff.length--;
    }
    return this;
  };

  Polynomial.prototype.toStringPolynomial = function() {
    var cur, index, result;
    result = "";
    index = this.degree;
    while (index >= 0) {
      cur = this.coeff[index];
      if (result) {
        if (cur || _visible_zeros_) {
          result += " + ";
        }
      }
      if (cur || _visible_zeros_) {
        if (index === 0) {
          result += cur;
        } else {
          result += cur + "x<sup>" + index + "</sup>";
        }
      }
      index--;
    }
    return result;
  };

  Polynomial.prototype.equal = function(polynomial) {
    var elem, i, index, len, ref;
    this.degree = polynomial.degree;
    this.field = polynomial.field;
    ref = polynomial.coeff;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      elem = ref[index];
      this.coeff[index] = elem;
    }
    this.coeff.length = this.degree + 1;
    return this.normalize();
  };

  Polynomial.prototype.add = function(polynomial) {
    var a, b, elem, i, index, len, ref, result;
    if (this.field !== polynomial.field) {
      console.log("Error: Attempt to realize [ADDITION] in different fields");
      return -1;
    }
    result = new Polynomial;
    if (this.degree < polynomial.degree) {
      a = polynomial;
      result.equal(polynomial);
      b = this;
    } else {
      a = this;
      result.equal(this);
      b = polynomial;
    }
    ref = b.coeff;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      elem = ref[index];
      result.coeff[index] += elem;
    }
    return result.normalize();
  };

  Polynomial.prototype.substract = function(polynomial) {
    var a, b, deg, elem, i, index, len, rc, ref, result;
    if (this.field !== polynomial.field) {
      console.log("Error: Attempt to realize [SUBSTRACTION] in different fields");
      return -1;
    }
    a = this.coeff;
    b = polynomial.coeff;
    deg = Math.max(this.degree, polynomial.degree);
    result = new Polynomial(deg, this.field);
    rc = result.coeff;
    ref = result.coeff;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      elem = ref[index];
      if (!a[index]) {
        rc[index] = -b[index];
      } else if (!b[index]) {
        rc[index] = a[index];
      } else {
        rc[index] = a[index] - b[index];
      }
    }
    return result.normalize();
  };

  Polynomial.prototype.multiply = function(polynomial) {
    var elem1, elem2, i, index1, index2, j, len, len1, rc, ref, ref1, result;
    if (this.field !== polynomial.field) {
      console.log("Error: Attempt to realize [MULTIPLICATION] in different fields");
      return -1;
    }
    result = new Polynomial(this.degree + polynomial.degree, this.field);
    rc = result.coeff;
    ref = this.coeff;
    for (index1 = i = 0, len = ref.length; i < len; index1 = ++i) {
      elem1 = ref[index1];
      ref1 = polynomial.coeff;
      for (index2 = j = 0, len1 = ref1.length; j < len1; index2 = ++j) {
        elem2 = ref1[index2];
        if (!elem1 || !elem2) {
          continue;
        }
        rc[index1 + index2] += elem1 * elem2;
      }
    }
    return result.normalize();
  };

  Polynomial.prototype._scalarMultiply = function(scalar) {
    var elem, i, index, len, rc, ref, result;
    result = new Polynomial;
    result.equal(this);
    rc = result.coeff;
    ref = result.coeff;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      elem = ref[index];
      rc[index] = elem * scalar;
    }
    return result.fieldify();
  };

  Polynomial.prototype._powerShift = function(pow) {
    var rc, result;
    if (pow <= 0) {
      return this;
    }
    result = new Polynomial;
    result.equal(this);
    result.degree += pow;
    rc = result.coeff;
    while (pow) {
      rc.unshift(0);
      pow--;
    }
    return result.normalize();
  };

  Polynomial.prototype.divide = function(polynomial) {
    var a, b, index1, index2, logging, result, tmp, zero;
    logging = false;
    if (logging) {
      tmp = _visible_zeros_;
      _visible_zeros_ = true;
    }
    if (this.field !== polynomial.field) {
      console.log("Error: Attempt to realize [DIVISION] in different fields");
      return -1;
    }
    if (this.degree < polynomial.degree) {
      zero = new Polynomial();
      return zero;
    }
    this.normalize();
    polynomial.normalize();
    result = new Polynomial(this.degree, this.field);
    a = new Polynomial;
    b = new Polynomial;
    a.equal(this);
    index1 = a.degree;
    index2 = 0;
    if (logging) {
      console.log(this.toStringPolynomial());
      console.log("=======================================");
    }
    while (index1 > polynomial.degree - 1) {
      if (!a.coeff[index1]) {
        index1--;
        continue;
      }
      b.equal(polynomial);
      index2 = 0;
      while (index2 < this.field) {
        b.equal(polynomial._scalarMultiply(index2));
        if (b.coeff[b.degree] === a.coeff[index1]) {
          break;
        }
        index2++;
      }
      result.coeff[a.degree - polynomial.degree] = index2;
      b.equal(b._powerShift(index1 - polynomial.degree));
      a.equal(a.substract(b));
      a.fieldify;
      if (logging) {
        console.log("-");
        console.log(b.toStringPolynomial());
        console.log("---------------------------------------");
        console.log(a.toStringPolynomial());
      }
      index1--;
    }
    if (logging) {
      _visible_zeros_ = tmp;
      console.log("\nResult: " + (result.toStringPolynomial()));
      console.log("\nReminder: " + (a.toStringPolynomial()));
    }
    return result.normalize();
  };

  Polynomial.prototype.parse = function(inputStr) {
    var monomials, result;
    result = new Polynomial(0, this.field);
    monomials = inputStr.split("+");
    result.degree = monomials.length;
    monomials.map(function(monomial) {
      var check, cur, deg, e, error, strCur, tmp;
      try {
        cur = parseInt(monomial, 10);
        if (isNaN(cur)) {
          throw 1;
        }
        strCur = String(cur);
        monomial = monomial.slice(monomial.indexOf(strCur) + strCur.length);
        tmp = monomial.indexOf("^");
        if (tmp === -1) {
          if (!result.coeff[0]) {
            if (isNaN(parseInt(monomial, 10))) {
              result.coeff[0] = cur;
              return;
            } else {
              throw 2;
            }
          } else {
            throw 3;
          }
        }
        monomial = monomial.slice(tmp + 1);
        deg = parseInt(monomial, 10);
        if (isNaN(deg)) {
          throw 3;
        }
        if (result.coeff[deg] === void 0) {
          result.coeff[deg] = cur;
        } else {
          result.coeff[deg] += cur;
          throw 4;
        }
      } catch (error) {
        e = error;
        check = "\n\t\t Check 'HELP' for instructions.";
        if (e === 1) {
          console.error("Error: Bad coefficient" + check);
        }
        if (e === 2) {
          console.error("Error: Can't find \"^\" after coefficient" + check);
        }
        if (e === 3) {
          console.error("Error: Bad degree" + check);
        }
        if (e === 4) {
          console.warn("Warning: Two or more monomials have the same degree");
        }
        return -1;
      }
    });
    result.degree = result.coeff.length - 1;
    result.normalize();
    this.coeff = result.coeff;
    this.degree = result.degree;
    return this;
  };

  return Polynomial;

})();

test1 = new Polynomial(4, 5, [3, 2, 1, 0, 4]);

test2 = new Polynomial(1, 5, [0, 1]);

result = new Polynomial;

result.equal(test1.divide(test2));

console.log("========");

console.log(test1);

console.log("-");

console.log(test2);

console.log(result);
