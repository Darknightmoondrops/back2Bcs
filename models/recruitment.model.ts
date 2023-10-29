import mongoose, { Document, Model, Schema } from "mongoose";

export interface Recruitment {
  [P: string]: string;
}

const recruitmentSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  familyName: { type: String, required: true },
  fatherName: { type: String, required: true },
  nationalCode: { type: String, required: true, unique: true },
  birthCertificate: { type: String, required: true },
  religion: { type: String, required: true },
  religionTwo: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  placeOfIssue: { type: String, require: true },
  dateOfBirth: { type: String, require: true },
  maritalStatus: { type: String, require: true },
  numberOfChildren: { type: String },
  militaryServiceStatus: { type: String, require: true },
  exemptionType: { type: String, require: true },
  insuranceHistory: { type: String },
  insurancePeriod: { type: String },
  address: { type: String, require: true },
  postalCode: { type: String, require: true },
  landlinePhone: { type: String },
  phoneNumber: { type: String, require: true },
  essentialContactNumber: { type: String, require: true },
  jobTitle: { type: String },
  gettingToKnowTheOrganization: { type: String },
  typeOfCooperation: { type: String, require: true },
  grade: { type: String, require: true },
  fieldOfStudy: { type: String, require: true },
  trainingCenter: { type: String },
  gPA: { type: String },
  studying: { type: String, require: true },
  continuingEducation: { type: String, require: true },
  organizations: { type: String },
  fieldOfActivity: { type: String },
  jobPosition: { type: String },
  collaborationPeriod: { type: String },
  lastSalary: { type: String },
  terminationOfCooperation: { type: String },
  organizationPhone: { type: String },
  theTitleOfSkills: { type: String },
  languages: { type: String },
  software: { type: String },
  colleagueAcquaintances: { type: String },
  nameAndFamilyName: { type: String },
  personsRelationship: { type: String },
  employmentCompany: { type: String },
  jobPositionTwo: { type: String },
  phoneNumberTwo: { type: String },
  drugs: { type: String, require: true },
  drugsDisc: { type: String },
  specialDisease: { type: String, require: true },
  specialDiseaseDisc: { type: String },
  rightsRequested: { type: String },
  insuranceHistoryTwo: { type: String },
});

const RecruitmentModel: Model<Recruitment> = mongoose.model<Recruitment>(
  "Recruitment",
  recruitmentSchema
);

export default RecruitmentModel;
