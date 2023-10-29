import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import express, { Request, Response } from "express";
import Docxtemplater from "docxtemplater";
import * as nodemailer from "nodemailer";
import PizZip from "pizzip";
import { Recruitment } from "../models/recruitment.model";
import RecruitmentModel from "../models/recruitment.model";
import { Exhibition } from "../models/exhibition.model";
import ExhibitionModel from "../models/exhibition.model";
const formsRouter = express.Router();

formsRouter.post("/Exhibition", async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const phone: string = req.body.phone;
  const compName: string = req.body.compName;
  const industry: string = req.body.industry;
  const fieldOfActivity: string = req.body.fieldOfActivity;
  const jobPosition: string = req.body.jobPosition;
  try {
    const exhibition: Exhibition = new ExhibitionModel({
      name,
      phone,
      compName,
      industry,
      fieldOfActivity,
      jobPosition,
    });
    await exhibition.save();
    res.status(201).json("anjam shod !");
  } catch (error) {
    res.status(500).json({ error });
  }
});

formsRouter.post("/Recruitment", async (req: Request, res: Response) => {
  try {
    const recruitmentData: Recruitment = req.body;
    const recruitment = new RecruitmentModel(recruitmentData);
    await recruitment.save();
    // Load the docx file as binary content
    const content = fs.readFileSync(
      path.resolve(__dirname, "Special-recruitment-form.docx"),
      "binary"
    );
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render({
      name: recruitment.name,
      familyName: recruitment.familyName,
      fatherName: recruitment.fatherName,
      nationalCode: recruitment.nationalCode,
      birthCertificate: recruitment.birthCertificate,
      religion: recruitment.religion,
      religionTwo: recruitment.religionTwo,
      placeOfBirth: recruitment.placeOfBirth,
      placeOfIssue: recruitment.placeOfIssue,
      dateOfBirth: recruitment.dateOfBirth,
      maritalStatus: recruitment.maritalStatus,
      numberOfChildren: recruitment.numberOfChildren,
      militaryServiceStatus: recruitment.militaryServiceStatus,
      exemptionType: recruitment.exemptionType,
      insuranceHistory: recruitment.insuranceHistory,
      insurancePeriod: recruitment.insurancePeriod,
      address: recruitment.address,
      postalCode: recruitment.postalCode,
      landlinePhone: recruitment.landlinePhone,
      phoneNumber: recruitment.phoneNumber,
      essentialContactNumber: recruitment.essentialContactNumber,
      gettingToKnowTheOrganization: recruitment.gettingToKnowTheOrganization,
      jobTitle: recruitment.jobTitle,
      typeOfCooperation: recruitment.typeOfCooperation,
      grade: recruitment.grade,
      fieldOfStudy: recruitment.fieldOfStudy,
      trainingCenter: recruitment.trainingCenter,
      gPA: recruitment.gPA,
      studying: recruitment.studying,
      continuingEducation: recruitment.continuingEducation,
      organizations: recruitment.organizations,
      fieldOfActivity: recruitment.fieldOfActivity,
      jobPosition: recruitment.jobPosition,
      collaborationPeriod: recruitment.collaborationPeriod,
      lastSalary: recruitment.lastSalary,
      terminationOfCooperation: recruitment.terminationOfCooperation,
      organizationPhone: recruitment.organizationPhone,
      theTitleOfSkills: recruitment.theTitleOfSkills,
      languages: recruitment.languages,
      software: recruitment.software,
      colleagueAcquaintances: recruitment.colleagueAcquaintances,
      nameAndFamilyName: recruitment.nameAndFamilyName,
      personsRelationship: recruitment.personsRelationship,
      employmentCompany: recruitment.employmentCompany,
      jobPositionTwo: recruitment.jobPositionTwo,
      phoneNumberTwo: recruitment.phoneNumberTwo,
      drugs: recruitment.drugs,
      drugsDisc: recruitment.drugsDisc,
      specialDisease: recruitment.specialDisease,
      specialDiseaseDisc: recruitment.specialDiseaseDisc,
      rightsRequested: recruitment.rightsRequested,
      insuranceHistoryTwo: recruitment.insuranceHistoryTwo,
    });
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });
    const outputPath = `../Recruitment/${recruitment.phoneNumber}.docx`;
    fs.writeFileSync(path.resolve(__dirname, outputPath), buf);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "recruitmentbcsholding@gmail.com",
        pass: "geeoxjuknryypwgk",
      },
      port: 587,
      secure: false,
    });

    const mailOptions = {
      from: "recruitmentbcsholding@gmail.com",
      to: "ariansoleimanzadeh7@gmail.com",
      subject: "Recruitment Form",
      text: `فرم استخدام آقا / خانم ${recruitment.name} ${recruitment.familyName} :`,
      attachments: [
        {
          filename: `${recruitment.phoneNumber}.docx`,
          path: path.resolve(__dirname, outputPath),
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        // Handle error
      } else {
        console.log("Email sent: " + info.response);
        // Handle success
      }
    });
    res.status(201).json("anjam shod !");
  } catch (error) {
    res.status(500).json({ error });
  }
});
export default formsRouter;
