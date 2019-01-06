const utils = require('./Utils')

const CryptoBears = utils.CryptoBears
const BearBucks = utils.BearBucks
const checkState = utils.checkState
const expectRevert = utils.expectRevert

const amount = 100

contract('BearBucksNegativeTests', async function (accounts) {

  beforeEach('Make fresh contract', async function () {
    // We let accounts[0] represent the CryptoBearsContract.
    bearBucks = await BearBucks.new({from: accounts[0]})
  })

  it('should have correct initial state', async function () {
    await checkState([bearBucks], [[]], accounts)
  })

  it('should fail to mint if not CryptoBearsContract', async function () {
    await expectRevert(bearBucks.mint(accounts[1], amount, {from: accounts[2]}))
    await checkState([bearBucks], [[]], accounts)
  })

  it('should fail to burn if not CryptoBearsContract', async function () {
    await bearBucks.mint(accounts[1], amount, {from: accounts[0]})
    await expectRevert(bearBucks.burn(accounts[1], amount, {from: accounts[2]}))

    var stateChanges = [
      {'var': 'totalSupply', 'expect': amount},
      {'var': 'balanceOf.a1', 'expect': amount},
    ]
    await checkState([bearBucks], [stateChanges], accounts)
  })

  it('should fail to placeBet if not CryptoBearsContract', async function () {
    await bearBucks.mint(accounts[1], amount, {from: accounts[0]})
    await bearBucks.approve(accounts[0], amount, {from: accounts[1]})
    await expectRevert(bearBucks.placeBet(accounts[1], amount, {from: accounts[3]}))

    var stateChanges = [
      {'var': 'totalSupply', 'expect': amount},
      {'var': 'balanceOf.a1', 'expect': amount},
      {'var': 'allowance.a1.a0', 'expect': amount}
    ]
    await checkState([bearBucks], [stateChanges], accounts)
  })

  /*NOTE: This test gives away part of the solution*/
  it('should fail to placeBet greater than balance', async function () {
    await bearBucks.mint(accounts[1], amount, {from: accounts[0]})
    await bearBucks.approve(accounts[0], amount+1, {from: accounts[1]})
    await expectRevert(bearBucks.placeBet(accounts[1], amount+1, {from: accounts[0]}))

    var stateChanges = [
      {'var': 'totalSupply', 'expect': amount},
      {'var': 'balanceOf.a1', 'expect': amount},
      {'var': 'allowance.a1.a0', 'expect': amount+1}
    ]
    await checkState([bearBucks], [stateChanges], accounts)
  })

  /*NOTE: This test gives away part of the solution*/
  it('should fail to placeBet if allowance of CryptoBearsContract is less than betSum', async function () {
    await bearBucks.mint(accounts[1], amount, {from: accounts[0]})
    await bearBucks.approve(accounts[0], amount-1, {from: accounts[1]})
    await expectRevert(bearBucks.placeBet(accounts[1], amount, {from: accounts[0]}))

    var stateChanges = [
      {'var': 'totalSupply', 'expect': amount},
      {'var': 'balanceOf.a1', 'expect': amount},
      {'var': 'allowance.a1.a0', 'expect': amount-1}
    ]
    await checkState([bearBucks], [stateChanges], accounts)
  })

  it('should fail to removeBet if not CryptoBearsContract', async function () {
    await bearBucks.mint(accounts[1], amount, {from: accounts[0]})
    await bearBucks.approve(accounts[0], amount, {from: accounts[1]})
    await bearBucks.placeBet(accounts[1], amount, {from: accounts[0]})
    await expectRevert(bearBucks.removeBet(accounts[1], amount, {from: accounts[3]}))

    var stateChanges = [
      {'var': 'totalSupply', 'expect': amount},
      {'var': 'balanceOf.a1', 'expect': amount},
      {'var': 'allowance.a1.a0', 'expect': amount},
      {'var': 'betSum.a1', 'expect': amount}
    ]
    await checkState([bearBucks], [stateChanges], accounts)
  })

  /*NOTE: This test gives away part of the solution*/
  it('should fail to approve amount less than betSum for CryptoBearsContract', async function () {
    await bearBucks.mint(accounts[1], amount, {from: accounts[0]})
    await bearBucks.approve(accounts[0], amount, {from: accounts[1]})
    await bearBucks.placeBet(accounts[1], amount, {from: accounts[0]})
    await expectRevert(bearBucks.approve(accounts[0], amount-1, {from: accounts[1]}))

    var stateChanges = [
      {'var': 'totalSupply', 'expect': amount},
      {'var': 'balanceOf.a1', 'expect': amount},
      {'var': 'allowance.a1.a0', 'expect': amount},
      {'var': 'betSum.a1', 'expect': amount}
    ]
    await checkState([bearBucks], [stateChanges], accounts)
  })

})
