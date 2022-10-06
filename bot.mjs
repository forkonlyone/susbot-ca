import { Telegraf } from 'telegraf';
import pkg from 'evm';
import Web3 from 'web3';

const { EVM } = pkg;
const bot = new Telegraf('5533081456:AAF7y_lhUxud4fNyM0xXtrWL2QF5sYGgmd0');

bot.on("text", async (ctx) => {
    if(ctx.message.chat.type != 'private')
    {
        let chkmsg = ctx.message.text;
        chkmsg = chkmsg.toLowerCase();
        let contract = chkmsg.match(/(\b0x[a-f0-9]{40}\b)/g);
        if(contract != null) 
        { 
            var freport = `\n\n<b>Contract Functions</b>\n`;
            var chainId = 0;
            var web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org")); 
            var evmcode = await web3.eth.getCode(contract.toString());
            if(evmcode == '0x')
            {
                var web3 = new Web3(new Web3.providers.HttpProvider("https://api.mycryptoapi.com/eth")); 
                var evmcode = await web3.eth.getCode(contract.toString());
                if(evmcode != '0x')
                {
                    const evm = new EVM(evmcode);
                    var functions = evm.getFunctions();
                    chainId = 1;
                    for(var i=0;i<functions.length;i++)
                    {
                        freport += `\n<code>${functions[i]}</code>`;
                    }
                }
            }
            else
            {
                const evm = new EVM(evmcode);
                var functions = evm.getFunctions();
                chainId = 56;
                for(var i=0;i<functions.length;i++)
                {
                    freport += `\n<code>${functions[i]}</code>`;
                }
            }
            var report = `<b>Contract Details</b>\n`;
            if(chainId == 56)
            {
                report += `\nContract: <code>${contract}</code>`;
                report += `\nSource: <a href="https://bscscan.com/address/${contract}#code">View on BSCScan</a>`;
                report += `\nNetwork: <code>Binance Smart Chain</code>`;
            }
            if(chainId == 1)
            {
                report += `\nContract: <code>${contract}</code>`;
                report += `\nSource: <a href="https://etherscan.io/address/${contract}#code">View on EtherScan</a>`;
                report += `\nNetwork: <code>Ethereum Mainnet</code>`;
            }
            report += freport;
            report += `\n\n<code>Add me to your group to scan contract functions even if the contract isn't verified!</code>`;
            ctx.replyWithHTML(report, {disable_web_page_preview: true});
        } 
    }
    else 
    {
        let chkmsg = ctx.message.text;
        chkmsg = chkmsg.toLowerCase();
        let contract = chkmsg.match(/(\b0x[a-f0-9]{40}\b)/g);
        if(contract != null)
        {
            ctx.replyWithHTML(`<code>This bot can only be used in Groups! Please add the Bot to any group to start scanning Contracts.</code>`, {disable_web_page_preview: true, reply_markup: {inline_keyboard: [[ { text: "Join 👾 Spacebar Lounge", url: `t.me/spacebarlounge` } ]]}});
        }
    }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));