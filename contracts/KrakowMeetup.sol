// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract KrakowMeetup is ERC721URIStorage, ERC721Enumerable, Ownable, ERC721Pausable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    uint public MAX_ELEMENTS = 64;
    uint public PRICE = 0;
    
    // operator 
    address public tokenURIOperator;
    
    event RequestedTokenURI(uint indexed requestForTokenId);
 
    // Only contract owner or designated operator
    modifier canSetTokenURI {
        require(
            _msgSender() == owner() || _msgSender() == tokenURIOperator,
            "Needs to be owner or tokenURIOperator"
        );
        _;
    }
    
    constructor() ERC721("Krakow Meetup", "KMU") {
        setPaused(true);
    }
    
    function mint(address _to) public payable {
        require(msg.value >= PRICE, "Price too low");
        require(_totalSupply() <= MAX_ELEMENTS, "Sale end");
        require(balanceOf(_to) == 0, "Only one per account allowed");
        
        uint id = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, id);
        emit RequestedTokenURI(id);
    }
    
    function _totalSupply() internal view returns (uint) {
        return _tokenIdCounter.current();
    }
    
    function setPaused(bool state) public onlyOwner {
        if (state == true) {
            _pause();
            return;
        }
        _unpause();
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Pausable, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function totalMint() public view returns (uint256) {
        return _totalSupply();
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public canSetTokenURI {
        _setTokenURI(tokenId, _tokenURI);
    }
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual override(ERC721URIStorage){
        super._setTokenURI(tokenId, _tokenURI);
    }
    
    function setTokenURIOperator(address _tokenURIOperator) public onlyOwner {
        tokenURIOperator = _tokenURIOperator;
    }
    
    function withdraw(address _address, uint _amount) public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0);
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }
    
    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override(ERC721Enumerable) returns (uint) {
        return super.tokenOfOwnerByIndex(owner, index);
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}