//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Record} from "./Record.sol";
import {HRABAC} from "./HRABAC.sol";

contract AccessControl is HRABAC, Record {

	//policy with attributes 
	function policyOwn(address _subjectAttributeValue, address _objectAttributeValue) public pure returns (bool) {

		return _subjectAttributeValue == _objectAttributeValue;
	}

	//get data of a healthRecord
	function seeHealthRecordData(uint256 healthRecordID) public view returns (string memory) {
		if (this.checkIsActive(msg.sender) && 
			(this.policyOwn(msg.sender, healthRecords[healthRecordID].patient) ||
			this.policyOwn(msg.sender, healthRecords[healthRecordID].doctor) || 
			ADMIN == roles[msg.sender].name))
			{
				return healthRecords[healthRecordID].data;
			} 
			return '';
	}


	modifier onlyDoctor {
      		require(this.checkIsActive(msg.sender) && DOCTOR == roles[msg.sender].name, "The user is not doctor!");
       		_;
   	}

   	// create a healthRecord
	function createHealthRecord(address _patientAddress,  string memory _medicalData,  uint256 _id) 
	external  onlyDoctor {

	    	healthRecords[_id] = HealthRecord({patient: _patientAddress, doctor: msg.sender, 
	    	data: _medicalData, id:_id});
	}
}