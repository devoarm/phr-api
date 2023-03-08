import express, { ErrorRequestHandler, Request, Response } from "express";
import moment from "moment";
import dbHdc from "../config/dbHdc";
import { CoverageType } from "../interfaces/phr/Encounter.type";
import { PhrCoverageMap } from "../service/phrMap/coverageMap.service";
import { PhrVitalSignsMap } from "../service/phrMap/vitalSignsMap.service";

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
export const GetEncounter = async (req: Request, res: Response) => {
  try {
    const { seq } = req.params;
    const converageMap = new PhrCoverageMap();
    const phrVitalSignsMap = new PhrVitalSignsMap();

    const converage = await converageMap.fetchInit(seq);
    const vitalSigns = await phrVitalSignsMap.fetchInit(seq);

    return res.json({
      status: 200,
      results: [
        {
          Encounter: [
            {
              Coverage: [...converage],
              vital_signs:{...vitalSigns[0]}
            },
          ],
        },
      ],
    });
  } catch (error: any) {
    return res.json({ status: 500, results: error.message });
  }
};
