import dbHdc from "../../config/dbHdc";
import {
  CoverageType,
  VitalSignsType,
} from "../../interfaces/phr/Encounter.type";

export class PhrVitalSignsMap {
  constructor() {}
  async fetchInit(seq: any) {
    const query = await dbHdc.raw(`#2.Coverage
    SELECT
    #vital_signs
    #-body_weight
    "final" as "status_body_weight",
    #--"valueQuantity"
    "" as "value_body_weight",
    "kg" as "unit_body_weight",
    
    #-"body_height"
    "final" as "status_body_height",
    #--"valueQuantity"
    "" AS "value_body_height",
    "cm" AS "unit_body_height",
    
    #-"body_temp"
    "final" as "status_body_temp",
    #--"valueQuantity"
    s.BTEMP AS "value_body_temp",
    "cel" AS "unit_body_temp",
    
    
    #-"bp_systolic"
    "final" as "status_bp_systolic",
    #--"valueQuantity"
    s.SBP AS "value_bp_systolic",
    "mmHg" AS "unit_bp_systolic",
    #"interpretation"
    "Normal" AS "text_bp_systolic",
    
    #-"bp_diastolic"
    "final" as "status_bp_diastolic",
    #--"valueQuantity"
    s.DBP AS "value_bp_diastolic",
    "mmHg" AS "unit_bp_diastolic",
    #"interpretation"
    "Normal" AS "text_bp_diastolic"
    
    FROM service s
    LEFT JOIN chospital ch ON s.HOSPCODE=ch.hoscode
    LEFT JOIN chospital hm ON s.MAIN=hm.hoscode 
    LEFT JOIN chospital hs ON s.HSUB=hs.hoscode 
    LEFT JOIN diagnosis_opd dio ON s.SEQ = dio.SEQ
    LEFT JOIN cicd10tm ON dio.DIAGCODE = cicd10tm.diagcode
    LEFT JOIN cicd298group icd298 ON  dio.DIAGCODE = icd298.icd10
    LEFT JOIN cinstype_new inn ON s.INSID = inn.instypecode
    LEFT JOIN cinstypegroup ing ON inn.instypegroup = ing.instypegroupcode
    
    WHERE s.SEQ = '${seq}'
    LIMIT 1
    `);
    return this.onMap(query);
  }
  onMap(query: any) {
    // return query    
    const allMap = query[0].map((item: VitalSignsType) => {
      return {
        body_weight: {
          status: item.status_body_weight,
          valueQuantity: {
            value: item.value_body_weight,
            unit: item.unit_body_weight,
          },
        },
        body_height: {
          status: item.status_body_height,
          valueQuantity: {
            value: item.value_body_height,
            unit: item.unit_body_height,
          },
        },
        body_temp: {
          status: item.status_body_temp,
          valueQuantity: {
            value: item.value_body_temp,
            unit: item.unit_body_temp,
          },
        },
        bp_systolic: {
          status: item.status_bp_systolic,
          valueQuantity: {
            value: item.value_bp_systolic,
            unit: item.unit_bp_systolic,
          },
          interpretation: {
            text: item.text_bp_systolic,
          },
        },
        bp_diastolic: {
          status: item.status_bp_diastolic,
          valueQuantity: {
            value: item.value_bp_diastolic,
            unit: item.unit_bp_diastolic,
          },
          interpretation: {
            text: item.text_bp_diastolic,
          },
        },
      };
    });
    return allMap;
  }
}
