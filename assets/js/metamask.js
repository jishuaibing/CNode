

if (web3.version.network == '1') {
    CoFiStakingRewards = '0xD16EeAfc4f614589eED0bc9294C1aE15F459831A'
    var USDT_addr = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    var HBTC_addr = "0x0316EB71485b0Ab14103307bf65a021042c6d380"

} else if (web3.version.network == '3') {
    USDT_addr = '0x200506568C2980B4943B5EaA8713A5740eb2c98A'
    HBTC_addr = '0xA674f71ce49CE7F298aea2F23D918d114965eb40'
    CoFiStakingRewards = '0xDe80d5423569Ea4104d127e14E3fC1BE0486531d'
    CoFiXVaultForCNode = '0x1a31b517ABF0D2F4f11A797d7b8622859429AA25'
    CoFiXNode = '0x1467459E5BC77C5D350D6c31bA69351Df1e1E3A2'
} else {
    USDT_addr = '0x200506568C2980B4943B5EaA8713A5740eb2c98A'
    HBTC_addr = '0xA674f71ce49CE7F298aea2F23D918d114965eb40'
    CoFiStakingRewards = '0xC8b29e0b4F5e9A55a0130934A690655BefbA34B4'
}// 检查web3是否已经注入到(Mist/MetaMask)
// 现在你可以启动你的应用并自由访问 Web3.js:
// startApp()
window.addEventListener('load', function () {
    console.log('web3')
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('web3', 3)
        switch (web3.version.network) {
            case '1': {
                const node = getNode();
                console.log('Used node: ' + node);
                web3 = new Web3(new Web3.providers.HttpProvider(node));
                break;
            }
            case '3': {
                web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
                break;
            }
            default: {
                const node = getNode();
                console.log('Used node: ' + node);
                web3 = new Web3(new Web3.providers.HttpProvider(node));
                break;
            }
        }

    }
    console.log('web32', web3)
    $('.push').click(function () {
        if (window.ethereum) {
            // 请求用户授权
            $(this).children('.loading').show()
            $('.contact').css('pointer-events', 'none')
            window.ethereum.enable().then(function (res) {
                console.log(res)
                setInterval(function () {
                    if (ethereum.selectedAddress !== "") {
                        location.reload()
                    }
                }, 1500)
            }).catch(function (reason) {
                // Handle error. Likely the user rejected the login:
                $('.push').children('.loading').hide()
                $('.contact').css('pointer-events', 'auto')

            })
        }
    })

    // connect wallet
    ethereum.on('accountsChanged', function (accounts) {
        console.log(accounts[0])
        location.reload()
    })
    web3.eth.getAccounts((error, accounts) => {
        $('.wallet_addr').text(hidden_address(accounts[0]))
        if (accounts.length == 0) {
            $('.push').css('display', 'block')
            $('.sq_usdt').css('display', 'none')
            $('.rg_max').hide()
            $('.rg_usdt').css('display', 'none')
        } else {
            $('.push').hide()
            $('.cqu').css('display', 'flex')
            $('.receive').css('display', 'block')
        }
        var stakingPoolForPairContract = new web3.eth.Contract(CoFiXVaultForCNodeAbi, CoFiXVaultForCNode);
        stakingPoolForPairContract.methods.cnodePool().call().then(function (result) {
            // console.log(result)
            var pool_addr = result
            var myContract = new web3.eth.Contract(ERC20Abi, CoFiXNode);
            myContract.methods.allowance(accounts[0], pool_addr).call().then(function (result) {
                var sqnum_usdt = web3.utils.toWei(result, 'wei');
                console.log(sqnum_usdt)
                if (sqnum_usdt > 0) {

                    $('.inCofi_sq').hide()
                    $('.cofi_in').css({
                        'width': '100%',
                        'pointer-events': 'auto',
                        'background': 'rgba(228, 140, 36, 1)',
                        'color': 'rgba(255, 255, 255, 1)'
                    })
                } else {
                    $('.inCofi_sq').show()
                    $('.cofi_in').css({
                        'width': '45%',
                        'pointer-events': 'none',
                        'background': 'rgba(125, 125, 125, .39)',
                        'color': 'rgba(125, 125, 125, 1)'
                    })
                }
            })
        })

        var stakingPoolForPairContract = new web3.eth.Contract(CoFiXVaultForCNodeAbi, CoFiXVaultForCNode);
        stakingPoolForPairContract.methods.cnodePool().call().then(function (result) {
            // console.log(result)
            var pool_addr = result
            console.log(pool_addr)
            var earned = new web3.eth.Contract(CoFiStakingRewardsAbi, pool_addr);
            earned.methods.earned(accounts[0]).call().then(function (result) {
                console.log(result)
                var earned = web3.utils.fromWei(result, 'ether')
                if (earned * 1 < 0.00000001) {
                    earned = 0
                }
                console.log(earned)
                $('.yw_cofi').text(cutZero(formatDecimal((earned), 8).slice(0, 14)))
                // console.log("已挖出cofi", earned)
            })
            var rewardRate = new web3.eth.Contract(CoFiStakingRewardsAbi, pool_addr);
            rewardRate.methods.rewardRate().call().then(function (result) {
                var rewardRate = result / 1e18
                // console.log(rewardRate)
                $('.wk_speed').text(cutZero(formatDecimal((rewardRate * 6171.4), 8).slice(0, 14)))
                // console.log("挖矿速度", rewardRate)
            })
            var deposited = new web3.eth.Contract(ERC20Abi, pool_addr);
            deposited.methods.balanceOf(accounts[0]).call().then(function (result) {
                console.log(result)
                // var deposited = web3.utils.fromWei(result, 'ether') * 1
                // $('.yc_fe').text(cutZMath.absero((deposited*1-0.000000005).toFixed(8).slice(0,14)))
                if (result * 1 < 0.00000001) {
                    result = 0
                }
                // $('.sh_fe').text(cutZero(formatDecimal(deposited, 8).slice(0, 14)))
                $('.yc_fe1').text(cutZero(formatDecimal(result, 8).slice(0, 14)))
                console.log("已存入份额", result)
            })
            var deposited = new web3.eth.Contract(ERC20Abi, CoFiXNode);
            deposited.methods.balanceOf(accounts[0]).call().then(function (result) {
                // var deposited = web3.utils.fromWei(result, 'ether') * 1
                // $('.yc_fe').text(cutZMath.absero((deposited*1-0.000000005).toFixed(8).slice(0,14)))
                console.log(result)
                if (result * 1 < 0.00000001) {
                    result = 0
                }
                // $('.sh_fe').text(cutZero(formatDecimal(deposited, 8).slice(0, 14)))
                $('.kc_fe1').text(cutZero(formatDecimal(result, 8).slice(0, 14)))
                console.log("可存入份额", result)
            })
        })
        setInterval(function () {
            transaction()
        }, 15000)
    })
    $('.inCofi_sq').click(function () {
        web3.eth.getAccounts((error, accounts) => {
            web3.eth.defaultAccount = accounts[0];
            // console.log(token)
            $('.inCofi_sq').children('.loading').show()
            var stakingPoolForPairContract = new web3.eth.Contract(CoFiXVaultForCNodeAbi, CoFiXVaultForCNode);
            stakingPoolForPairContract.methods.cnodePool().call().then(function (result) {
                // console.log(result)
                var pool_addr = result
                var sq_usdtContract = new web3.eth.Contract(ERC20Abi, CoFiXNode)
                sq_usdtContract.methods.approve(pool_addr,
                    ("999999999999999999999999999999999999")).send({
                        from: accounts[0]
                    }).on('transactionHash', function (hash) {
                        $('.contact').css('pointer-events', 'none')
                    })
                    .on('receipt', function (receipt) {
                        $('.inCofi_sq').hide()
                        $('.inCofi_sq').children('.loading').hide()
                        $('.contact').css('pointer-events', 'auto')
                        $('.cofi_in').css({
                            'width': '100%',
                            'pointer-events': 'auto',
                            'background': 'rgb(228, 140, 36)',
                            'color': 'rgb(255, 255, 255)'
                        })
                        setTimeout(function () {
                            transaction()
                        }, 50)
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        $('.inCofi_sq').hide()
                        $('.inCofi_sq').children('.loading').hide()
                        $('.contact').css('pointer-events', 'auto')
                    })
                    .on('error', function () {
                        $('.inCofi_sq').children('.loading').hide()
                        $('.contact').css('pointer-events', 'auto')
                    });
            })
        })
    })
    $('.cofi_in').click(function () {
        $('.cofi_ycbz').hide()
        $('.cofi_sqbz').hide()
        var _num = $('.countMoney1').val()
        // cofi_num = new Decimal(_num * 1e18)
        if (_num * 1 > 0) {
            web3.eth.getAccounts((error, accounts) => {
                var stakingPoolForPairContract = new web3.eth.Contract(CoFiXVaultForCNodeAbi, CoFiXVaultForCNode);
                stakingPoolForPairContract.methods.cnodePool().call().then(function (result) {
                    // console.log(result)
                    var pool_addr = result
                    var myContract2 = new web3.eth.Contract(ERC20Abi, CoFiXNode);
                    myContract2.methods.allowance(accounts[0], pool_addr).call().then(function (result) {
                        var cofi_sqnum = result * 1
                        console.log(cofi_sqnum)
                        if (cofi_sqnum > 0) {
                            var deposited = new web3.eth.Contract(ERC20Abi, CoFiXNode);
                            deposited.methods.balanceOf(accounts[0]).call().then(function (result) {
                                var deposited = result
                                console.log(deposited)
                                // $('.kc_fe').text(cutZero(formatDecimal(deposited,8).slice(0,14)))
                                // console.log("可存入份额", deposited, _num)
                                if (_num * 1 > deposited * 1) {
                                    $('.cofi_yebz').show()
                                    $('.countMoney1').addClass('borderStyle')
                                } else {
                                    $('.cofi_in').children('.loading').show()
                                    var myContract = new web3.eth.Contract(CoFiStakingRewardsAbi, pool_addr);
                                    myContract.methods.stake(_num).send({
                                        from: accounts[0]
                                    }).on('transactionHash', function (hash) {

                                    })
                                        .on('receipt', function (receipt) {
                                            //
                                            $('.cofi_in').children('.loading').hide()
                                            $('.contact').css('pointer-events', 'auto')
                                            setTimeout(function () {
                                                transaction()
                                            }, 50)
                                        })
                                        .on('confirmation', function (confirmationNumber, receipt) {
                                            //
                                            $('.cofi_in').children('.loading').hide()
                                            $('.contact').css('pointer-events', 'auto')
                                            $('.countMoney1').val('')
                                        })
                                        .on('error', function () {
                                            //
                                            $('.cofi_in').children('.loading').hide()
                                            $('.contact').css('pointer-events', 'auto')
                                        });
                                }
                            })
                        } else {
                            $('.qceth_sqbz ').show()
                        }
                    })
                })
            })
        }
    })
    $('.cofi_out').click(function () {
        var _num = $('.countMoney4').val()
        // console.log(cofi_num.toFixed())
        $('.cofi_yebz').hide()
        $('.cofi_sqbz').hide()
        if (_num * 1 > 0) {
            web3.eth.getAccounts((error, accounts) => {
                var stakingPoolForPairContract = new web3.eth.Contract(CoFiXVaultForCNodeAbi, CoFiXVaultForCNode);
                stakingPoolForPairContract.methods.cnodePool().call().then(function (result) {
                    // console.log(result)
                    var pool_addr = result
                    var deposited = new web3.eth.Contract(ERC20Abi, pool_addr);
                    deposited.methods.balanceOf(accounts[0]).call().then(function (result) {
                        var deposited = result
                        console.log(deposited)
                        if (deposited * 1 < 0.00000001) {
                            deposited = 0
                        }
                        // console.log("已存入份额", deposited)
                        if (_num * 1 > deposited) {
                            $('.qceth_ycbz').show()
                            $('.countMoney4').addClass('borderStyle')
                        } else {
                            $('.cofi_out').children('.loading').show()
                            var myContract = new web3.eth.Contract(CoFiStakingRewardsAbi, pool_addr);
                            myContract.methods.withdraw(_num).send({
                                from: accounts[0]
                            }).on('transactionHash', function (hash) {

                            })
                                .on('receipt', function (receipt) {
                                    //
                                    $('.cofi_out').children('.loading').hide()
                                    $('.contact').css('pointer-events', 'auto')
                                    setTimeout(function () {
                                        transaction()
                                    }, 50)
                                })
                                .on('confirmation', function (confirmationNumber, receipt) {
                                    //
                                    $('.cofi_out').children('.loading').hide()
                                    $('.contact').css('pointer-events', 'auto')
                                    $('.countMoney4').val('')
                                })
                                .on('error', function () {
                                    //
                                    $('.cofi_out').children('.loading').hide()
                                    $('.contact').css('pointer-events', 'auto')
                                });
                        }
                    })
                })
            })
        }
    })
    $('.receive_cofi').click(function () {
        web3.eth.getAccounts((error, accounts) => {
            var stakingPoolForPairContract = new web3.eth.Contract(CoFiXVaultForCNodeAbi, CoFiXVaultForCNode);
            stakingPoolForPairContract.methods.cnodePool().call().then(function (result) {
                // console.log(result)
                var pool_addr = result
                $('.receive_cofi').children('.loading').show()
                var myContract = new web3.eth.Contract(CoFiStakingRewardsAbi, pool_addr);
                myContract.methods.getReward().send({
                    from: accounts[0]
                }).on('transactionHash', function (hash) {

                })
                    .on('receipt', function (receipt) {
                        //
                        $('.receive_cofi').children('.loading').hide()
                        $('.contact').css('pointer-events', 'auto')
                        setTimeout(function () {
                            transaction()
                        }, 50)
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        //
                        $('.receive_cofi').children('.loading').hide()
                        $('.contact').css('pointer-events', 'auto')
                    })
                    .on('error', function () {
                        //
                        $('.receive_cofi').children('.loading').hide()
                        $('.contact').css('pointer-events', 'auto')
                    });
            })
        })
    })
    $('.countMoney').focus(function () {
        $(this).removeClass('borderStyle')
        $('.qceth_ycbz').hide()
        $('.cofi_yebz').hide()

    })
    function transaction () {
        web3.eth.getAccounts((error, accounts) => {
            $('.wallet_addr').text(hidden_address(accounts[0]))
            var stakingPoolForPairContract = new web3.eth.Contract(CoFiXVaultForCNodeAbi, CoFiXVaultForCNode);
            stakingPoolForPairContract.methods.cnodePool().call().then(function (result) {
                // console.log(result)
                var pool_addr = result
                console.log(pool_addr)
                var earned = new web3.eth.Contract(CoFiStakingRewardsAbi, pool_addr);
                earned.methods.earned(accounts[0]).call().then(function (result) {
                    var earned = web3.utils.fromWei(result, 'ether')
                    if (earned * 1 < 0.00000001) {
                        earned = 0
                    }
                    $('.yw_cofi').text(cutZero(formatDecimal(earned, 8).slice(0, 14)))
                    // console.log("已挖出cofi", earned)
                })
                var rewardRate = new web3.eth.Contract(CoFiStakingRewardsAbi, pool_addr);
                rewardRate.methods.rewardRate().call().then(function (result) {
                    var rewardRate = result / 1e18
                    // console.log(rewardRate)
                    $('.wk_speed').text(cutZero(formatDecimal((rewardRate * 6171.4), 8).slice(0, 14)))
                    // console.log("挖矿速度", rewardRate)
                })
                var deposited = new web3.eth.Contract(ERC20Abi, pool_addr);
                deposited.methods.balanceOf(accounts[0]).call().then(function (result) {
                    console.log(result)
                    // var deposited = web3.utils.fromWei(result, 'ether') * 1
                    // $('.yc_fe').text(cutZMath.absero((deposited*1-0.000000005).toFixed(8).slice(0,14)))
                    if (result * 1 < 0.00000001) {
                        result = 0
                    }
                    // $('.sh_fe').text(cutZero(formatDecimal(deposited, 8).slice(0, 14)))
                    $('.yc_fe1').text(cutZero(formatDecimal(result, 8).slice(0, 14)))
                    console.log("已存入份额", result)
                })
                var deposited = new web3.eth.Contract(ERC20Abi, CoFiXNode);
                deposited.methods.balanceOf(accounts[0]).call().then(function (result) {
                    // var deposited = web3.utils.fromWei(result, 'ether') * 1
                    // $('.yc_fe').text(cutZMath.absero((deposited*1-0.000000005).toFixed(8).slice(0,14)))
                    console.log(result)
                    if (result * 1 < 0.00000001) {
                        result = 0
                    }
                    // $('.sh_fe').text(cutZero(formatDecimal(deposited, 8).slice(0, 14)))
                    $('.kc_fe1').text(cutZero(formatDecimal(result, 8).slice(0, 14)))
                    console.log("可存入份额", result)
                })
            })
        })
    }
})

