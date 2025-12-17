// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Record {
	struct HealthRecord {
		address patient;
		address doctor;
		string data;
		uint256 id;
	}

	mapping (uint256 => HealthRecord) public healthRecords;
}