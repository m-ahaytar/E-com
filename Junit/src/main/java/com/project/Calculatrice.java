package com.project;

public class Calculatrice {
    public int additionner(int a, int b) { return a + b; }
    public int soustraire(int a, int b) { return a - b; }
    public int multiplier(int a, int b) { return a * b; }
    public double diviser(int a, int b) {
        if (b == 0) throw new ArithmeticException("Division par zéro");
        return (double) a / b;
    }
    public boolean estPair(int n) { return n % 2 == 0; }
    public boolean estPremier(int n) {
        if (n < 2) return false;
        for (int i = 2; i <= Math.sqrt(n); i++)
            if (n % i == 0) return false;
        return true;
    }
}