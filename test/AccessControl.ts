import { expect } from "chai";
import hre  from "hardhat";
const { ethers,networkHelpers } = await hre.network.connect();

describe("AccessControl", async function () {

 describe('Test HRABAC', async function() {
    let patientOwner;
    let otherPatient;
    let inactivePatientOwner;
    let doctor;
    let otherDoctor;
    let inactiveAdmin;
    let admin;

    let patientOwnerAddress;
    let otherPatientAddress;
    let inactivePatientOwnerAddress;
    let doctorAddress;
    let otherDoctorAddress;
    let inactiveAdminAddress;
    let adminAddress;

    let contractFactory;
    let contract;
    let instance;
    let newHealthRecord;
    let otherNewHealthRecord;

     beforeEach(async function () {
    // Contracts are deployed using the first signer/account by default
     [patientOwner, otherPatient, inactivePatientOwner, doctor, otherDoctor, inactiveAdmin, admin] = await ethers.getSigners();

    contractFactory = await ethers.getContractFactory("AccessControl");
    instance = await contractFactory.deploy();
    patientOwnerAddress = await patientOwner.getAddress();
    inactivePatientOwnerAddress = await inactivePatientOwner.getAddress();
    otherPatientAddress = await otherPatient.getAddress();
    doctorAddress = await doctor.getAddress();
    otherDoctorAddress = await otherDoctor.getAddress();
    inactiveAdminAddress = await inactiveAdmin.getAddress();
    adminAddress = await admin.getAddress();

    await instance.assignRole(patientOwnerAddress, 'Patient', true, true);
    await instance.assignRole(inactivePatientOwnerAddress, 'Patient', true, false);
    await instance.assignRole(otherPatientAddress, 'Patient', true, true);
    await instance.assignRole(doctorAddress, 'Doctor', true, true);
    await instance.assignRole(otherDoctorAddress, 'Doctor', true, true);
    await instance.assignRole(inactiveAdminAddress, 'Admin', true, false);
    await instance.assignRole(adminAddress, 'Admin', true, true);
    newHealthRecord = {
          ID: 1,
          patient: patientOwnerAddress,
          data: "Health data about patient"
        };
    await instance.connect(doctor).createHealthRecord(
          newHealthRecord.patient,
          newHealthRecord.data,
          newHealthRecord.ID
        );
    otherNewHealthRecord = {
          ID: 2,
          patient: otherPatientAddress,
          data: "Health data about other patient"
        };
    await instance.connect(doctor).createHealthRecord(
          otherNewHealthRecord.patient,
          otherNewHealthRecord.data,
          otherNewHealthRecord.ID
        );
  });
  it("1. - Test HRABAC - test whether doctor can create and access own created health record", async function () {
        const checkDoctor = await instance.connect(doctor).checkIsActive(doctorAddress);
        await expect(checkDoctor, "The role is active Doctor").to.true;
        const canDoctor = await instance.connect(doctor).seeHealthRecordData(newHealthRecord.ID);
        await expect(canDoctor).equal('Health data about patient');
  });

  it("2. - Test HRABAC - test whether doctor CANNOT access NOT own patient's created health record", async function () {
      const checkOtherDoctor = await instance.connect(otherDoctor).checkIsActive(otherDoctorAddress);
      expect(checkOtherDoctor, "The role is active Doctor").to.true;
      const canOtherDoctor = await instance.connect(otherDoctor).seeHealthRecordData(newHealthRecord.ID);
      expect(canOtherDoctor).equal('');
  });
  it("3. - Test HRABAC - test whether patient can access own health record", async function () {
      const checkPatientOwner = await instance.connect(patientOwner).checkIsActive(patientOwnerAddress);
      expect(checkPatientOwner, "The role is active Patient").to.true;
      const canPatientOwner = await instance.connect(patientOwner).seeHealthRecordData(newHealthRecord.ID);
      expect(canPatientOwner).equal('Health data about patient');
  });
  it("4. - Test HRABAC - test whether patient CANNOT access NOT own health record", async function () {
      const checkOtherPatient = await instance.connect(otherPatient).checkIsActive(otherPatient);
      expect(checkOtherPatient, "The role is active patient").to.true;
      const canOtherPatient = await instance.connect(otherPatient).seeHealthRecordData(newHealthRecord.ID);
      expect(canOtherPatient).equal('')
  });
    it('5. - Test HRABAC - test whether inactive patient CANNOT access own health record', async () => {
        const checkInactivePatientOwner = await instance.connect(inactivePatientOwner).checkIsActive(inactivePatientOwner);
        expect(checkInactivePatientOwner, "The role is active patient").to.false;
        const canInactivePatientOwner = await instance.connect(inactivePatientOwner).seeHealthRecordData(otherNewHealthRecord.ID);
        expect(canInactivePatientOwner).equal('');
    });

  it('6. - Test HRABAC - test whether admin can access health record', async () => {
        const checkAdmin = await instance.connect(admin).checkIsActive(adminAddress);
        expect(checkAdmin, "The role is active admin").to.true;
        const canAdmin = await instance.connect(admin).seeHealthRecordData(newHealthRecord.ID);
        expect(canAdmin).equal('Health data about patient');
    });

   it('7. - Test HRABAC - test whether inactive admin CANNOT access health record', async () => {
        const checkInactiveAdmin = await instance.connect(inactiveAdmin).checkIsActive(inactiveAdminAddress);
        expect(checkInactiveAdmin, "The role is active admin").to.false;
        const canInactiveAdmin = await instance.connect(inactiveAdmin).seeHealthRecordData(newHealthRecord.ID);
        expect(canInactiveAdmin).equal('');
    });
});
});

