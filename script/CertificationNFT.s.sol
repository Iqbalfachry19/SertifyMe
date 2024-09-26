// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Script, console2} from "forge-std/Script.sol";
import {CertificationNFT} from "../src/CertificationNFT.sol"; // Adjust the path accordingly

contract CertificationNFTDeployScript is Script {
    CertificationNFT public certificationNFT;

    function setUp() public {
        // Setup can be used to initialize variables if needed
    }

    function run() public {
        vm.startBroadcast(); // Start broadcasting the transaction

        // Deploy the CertificationNFT contract
        certificationNFT = new CertificationNFT();

        console2.log(
            "CertificationNFT deployed at:",
            address(certificationNFT)
        );

        vm.stopBroadcast(); // Stop broadcasting the transaction
    }
}
