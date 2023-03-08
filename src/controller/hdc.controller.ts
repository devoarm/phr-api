import express, { ErrorRequestHandler, Request, Response } from "express";
import moment from "moment";
import dbHdc from "../config/dbHdc";

require("dotenv").config();

export const GetTest = async (req: Request, res: Response) => {
  try {
    const query = await dbHdc.raw(`SELECT  
  'identifier' AS 'Patient_identifier',
  'official' AS 'Patient_identifier_use',
  'https://www.dopa.go.th' AS 'Patient_identifier_system',
  'CID' AS 'Patient_identifier_type',
  CID AS 'Patient_identifier_value',
  'period' AS 'Patient_identifier_period',
  '2023' AS 'Patient_identifier_period_start',
  'official' AS 'Patient_identifier_use',
  'http://bps.moph.go.th/new_bps/' AS 'Patient_identifier_system',
  'assigner' AS 'Patient_identifier_assigner',
  'official' AS 'Patient_identifier_assigner_use',
  'http://bps.moph.go.th/new_bps/' AS 'Patient_identifier_assigner_system',
  HOSPCODE AS 'Patient_identifier_assigner_value',
  hosname AS 'Patient_identifier_assigner_display',
  'HN' AS 'Patient_identifier_type',
  HN AS 'Patient_identifier_value',
  'period' AS 'Patient_identifier_period',
  '2023' AS 'Patient_identifier_period_start',
  'true' AS 'Patient_active'
FROM person
LEFT JOIN chospital ON chospital.hoscode = person.HOSPCODE
LIMIT 100`);
    return res.json({ status: 200, results: query });
  } catch (error: any) {
    return res.json({ status: 500, results: error.message });
  }
};
