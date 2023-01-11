import express, { NextFunction, Request, Response } from "express";
import data from "./data.json";
import {
  formatCurrency,
  formatCurrencyUsd,
  formatNumber,
  getStatChangeIcon,
} from "../utils/functions";
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  // res.status(200).json({ status: 'OK' })
  res.render("dashboard", {
    state: data.state,
    accounts: data.accounts,
    account_info: data.account_info,
    formatCurrency,
    formatCurrencyUsd,
    formatNumber,
    getStatChangeIcon,
  });
  next();
});

export default router;
