import dbHdc from "../../config/dbHdc";
import { CoverageType } from "../../interfaces/phr/Encounter.type";

export class PhrCoverageMap {
  constructor() {}
  async fetchInit(seq: string) {
    const query = await dbHdc.raw(`#1.Condition
    SELECT
    
    #identifier
    "https://www.nhso.go.th/certificate" AS "system_identifier",
    s.INSID AS identifier,
    s.INSID AS subscriberId,
    "active" AS "status",
    "http://terminology.hl7.org/CodeSystem/v3-ActCode" AS  "system",
    
    #type
    "http://terminology.hl7.org/CodeSystem/v3-ActCode" AS "system_type",
    "PUBLICPOL" AS "code_type",
    "public healthcare" AS "display_type",
    
    #relationship
    "http://terminology.hl7.org/CodeSystem/subscriber-relationship" AS "system_relationship",
    "self" AS "code_relationship",
    "Self" AS "display_relationship",
    
    #period
    "2011-05-23" AS "start_period",
    "2012-05-23" AS "end_period",
    
    #payor
    ing.instypegroupname AS "reference_payor",
    
    #class
    "http://terminology.hl7.org/CodeSystem/coverage-class" AS "system_class",
    "group" AS "code_class",
    "UCS" AS  "value_class",
    "สิทธิหลักประกันสุขภาพแห่งชาติ" AS "name_class",
    "http://terminology.hl7.org/CodeSystem/coverage-class" AS "system_class",
    "subgroup" AS "code_class",
    "89" AS "value_class_class",
    "ช่วงอายุ 12-59 ปี" AS "name_class",
    5000.00 AS "reimbursementAmount_class",
    
    #contract
    s.MAIN AS "reference_contract",
    "00000" AS "identifier_contract",
    hm.hosname AS "display_contract",
    
    s.HSUB AS "reference_contract",
    "00000" AS "identifier_contract",
    hs.hosname AS "display_contract",
    
    #2.Coverage
    s.HOSPCODE AS 'hcode_Coverage',
    ch.hosname,
    s.SEQ AS vn_Coverage,
    s.HN,
    #clinicalStatus
    "http://terminology.hl7.org/CodeSystem/conditionclinical" AS "system_clinicalStatus",
    "active" as  "code_clinicalStatus",
    "Active" AS "display_clinicalStatus",
    
    #verificationStatus
    "http://terminology.hl7.org/CodeSystem/condition-verstatus" AS "system_verificationStatus",
    "confirmed" AS "code_verificationStatus",
    "Confirmed" AS "display_verificationStatus",
    
    #category
    "http://snomed.info/sct" AS  "system_category",
    icd298.groupcode298 AS  "code_category",
    "Diagnosis" AS "display_category",
    
    #severity
    "http://snomed.info/sct" AS  "system_severity",
    "24484000" AS  "code_severity",
    "Severe" AS "display_severity",
    
    #code
    "http://hl7.org/fhir/sid/icd-10" AS "system_code",
    dio.DIAGCODE AS "code_code",
    cicd10tm.diagename As "display_code",
    cicd10tm.diagtname AS "text_code",
    
    #bodySite
    "http://snomed.info/sct" AS "system_bodySite",
    "49521004" AS "code_bodySite",
    "Left external ear structure" AS "display_bodySite",
    "Left Ear" AS  "text_bodySite",
    s.DATE_SERV AS "recordedDate_bodySite"
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
    return this.onMap(query)
  }
  onMap(query: any) {
    const identifier = query[0].map((item: CoverageType) => {
      return { system: item.system_identifier, value: "" };
    });
    const coding_type = query[0].map((item: CoverageType) => {
      return {
        system: item.system_type,
        code: item.code_type,
        display: item.display_type,
      };
    });
    const coding_relationship = query[0].map((item: CoverageType) => {
      return {
        system: item.system_type,
        code: item.code_type,
        display: item.display_type,
      };
    });
    const period = query[0].map((item: CoverageType) => {
      return {
        start: item.start_period,
        end: item.end_period,
      };
    });
    const payor = query[0].map((item: CoverageType) => {
      return {
        reference: item.reference_payor,
      };
    });
    const contract = query[0].map((item: CoverageType) => {
      return {
        reference: item.reference_contract,
        identifier: item.identifier_contract,
        display: item.display_contract,
      };
    });
    const Class = query[0].map((item: CoverageType) => {
      return {
        type: {
          coding: {
            system: item.system_class,
            code: item.code_class,
          },
        },
        value: item.value_class,
        name: item.name_class,
      };
    });

    const Coverage = [
      {
        identifier: identifier,
        subscriberId: query[0][0].subscriberId,
        status: query[0][0].status,
        type: {
          coding: coding_type,
        },
        relationship: { coding: coding_relationship },
        period: { ...period[0] },
        payor: payor,
        class: Class,
        reimbursementAmount: query[0][0].reimbursementAmount_class,
        contract: contract,
      },
    ];
    const mapAll = query[0].map((item: any, index: number) => {
      return {
        identifier: identifier,
        subscriberId: query[0][index].subscriberId,
        status: query[0][index].status,
        type: {
          coding: coding_type,
        },
        relationship: { coding: coding_relationship },
        period: { ...period[0] },
        payor: payor,
        class: Class,
        reimbursementAmount: query[0][index].reimbursementAmount_class,
        contract: contract,
      };
    });
    return mapAll;
  }
}
