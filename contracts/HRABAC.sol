//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HRABAC {

	struct Role {
		bytes32 name;
		bool isActive;
	}
	
	mapping (address => Role) public roles;
	mapping (address => bool) public isActive;

	bytes32 public constant PATIENT = keccak256("Patient");
	bytes32 public constant DOCTOR = keccak256("Doctor");
	bytes32 public constant ADMIN = keccak256("Admin");

	address public owner;
	
	constructor()
	{
		owner = msg.sender;
	}

	function getSender() public view returns (address)  
	{  
	    return msg.sender;  
	}
	
	function getOwner() public view returns (address)  
	{  
	    return owner;  
	}

	//assign role to an address
	function assignRole(address _user, string memory _name, bool _isRoleActive, bool _isUserActive) 
	external  onlyOwner returns (Role memory) {

		roles[_user] = Role({name: keccak256(abi.encodePacked(_name)), isActive: _isRoleActive});
		isActive[_user] = _isUserActive;
		return roles[_user];
	}

	//get an assigned role to an address
	function getAssignedRole(address _user) public view returns (Role memory role) {

		return roles[_user];
	}

	//make an address active or inactive
	function setAddressIsActive(address _user, bool _isUserActive) external  onlyOwner {

		isActive[_user] = _isUserActive;
	}

	//check whether an address is active
	function checkIsActive(address _user) external view returns (bool) {

		return roles[_user].isActive && isActive[_user];
	}

	modifier onlyOwner {
	
		require(msg.sender == owner, "The user is not owner!");
		_;
	}
}