$(function () {
    var adderss,type = 0,votingoptions;
    var contract = new Chain();
    $('#eth').on('click', checketh);
    $('#bsc').on('click', checkbsc);
    $('#heco').on('click', checkheco);
    $('#vote').on('click',vote)
    connectWallet();
    function checketh(){
        votingoptions = 1;
        $('#vote').attr('disabled',false)
    }
    function checkbsc(){
        votingoptions = 2;
        $('#vote').attr('disabled',false)
    }
    function checkheco(){
        votingoptions = 3;
        $('#vote').attr('disabled',false)
    }
    time()
    setInterval(function(){
        time()
    },1000)
    function time (){
        let dtime = new Date();
        let dday = dtime.setUTCDate(19);
        let dhour = dtime.setUTCHours(3);
        let dmin = dtime.setUTCMinutes(59);
        let dsecond = dtime.setUTCSeconds(59);
        let sday = dtime.getUTCDate();
        let shour = dtime.getUTCHours();
        let smin = dtime.getUTCMinutes();
        let ssecond = dtime.getUTCSeconds();
        let time = new Date();
        let day = time.getUTCDate();
        let hour = time.getUTCHours();
        let min = time.getUTCMinutes();
        let second = time.getUTCSeconds();
        let chour;
        let cday;
        if(hour<4){
            chour = shour - hour;
            cday = sday - day;
        }else{
            hour = 24
            chour = hour - shour;
            day += 1;
            cday = sday - day;
        }
        
        let cmin = smin - min;
        let csecond = ssecond - second;
        let timehtml = `${cday} d ${chour} h ${cmin} m ${csecond} s`;
        $('.time').text(`${timehtml}`)
    }
    function vote(){
        let button = $('#vote')
        if(votingoptions){
            disableButton(button)
            contract.vote(votingoptions).then(res=>{
                enableButton(button)
                getvotingOptions()
            }).catch(err=>{
                enableButton(button)
                getvotingOptions()
            })
        }else{

        }
    }
    function getvotingOptions(){
        contract.getvotingOptions().then(res=>{
            console.log(res)
            let text;
            if(res == 1){
                text = 'I'
            }
            if(res == 2){
                text = 'II'
            }
            if(res == 3){
                text = 'III'
            }
            if(res==0){
                text = ''
            }
            $('#vote_o').text(`${text}`)
        })
    }
    function connectWallet() {
        contract.connectWallet().then((res) => {
            if (res.success) {
                let walletid = ethereum.networkVersion;
                if(walletid == 1){
                    type = 0;
                    $('.netlogo').css(
                        "background-image",'url(../img/eth.png)'
                    );
                    $('.nettext').text('ETH');
                }
                if(walletid == 56){
                    type = 1;
                    $('.netlogo').css(
                        "background-image",'url(../img/bsc.png)'
                    );
                    $('.nettext').text('BSC');
                }
                if(walletid == 128){
                    type = 2;
                    $('.netlogo').css(
                        "background-image",'url(../img/heco.png)'
                    );
                    $('.nettext').text('HECO');
                }
                contract.initialize(0, type).then(() => {
                    adderss = contract.account
                    let account = contract.account;
                    let chainId = contract.chanId
                    account = account.slice(0, 6) +
                        "***" +
                        account.slice(account.length - 4, account.length);
                    $('#adderss').text(account);
                    $('.connect').hide();
                    $('#adderssbtn').show();
                    getvotingOptions();
                    getDeriVotingPower(+chainId,contract.account).then((res) => {
                        console.log(res)
                        let power;
                        let balanceOfDeri = +res.balanceOfDeri;
                        let balanceOfSlp = +res.balanceOfSlp;
                        let totalDeriOnSushi = +res.totalDeriOnSushi;
                        let totalSupply = +res.totalSupply;
                        let tot;
                        if(totalSupply == 0){
                            tot = 0;
                            power = balanceOfDeri
                        }else{
                            power = balanceOfDeri + (balanceOfSlp*totalDeriOnSushi/totalSupply)
                            tot = balanceOfSlp*totalDeriOnSushi/totalSupply
                        }
                        $('.power').text(`${balanceOfDeri} + ${tot} = ${power}`)
                    });
                })
            } else {
                alert('Cannot connect wallet')
            }
        })
    }
    function disableButton(button) {
        button.find("span.spinner").show();
        button.attr("disabled", true);
    }
    function enableButton(button) {
        button.find("span.spinner").hide();
        button.attr("disabled", false);
    }
})