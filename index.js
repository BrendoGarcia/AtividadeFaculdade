const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

// Função para realizar scraping de dados
async function scrapeData(url) {
    try {
        const { data } = await axios.get(url); // Faz a requisição HTTP
        const $ = cheerio.load(data); // Carrega o HTML no cheerio

        // Array para armazenar os dados dos jogadores
        const jogadores = [];

        // Seleciona cada linha da tabela
        $('tr.odd, tr.even').each((index, element) => {
            const nome = $(element).find('td.hauptlink a').text().trim();
            const posicao = $(element).find('td.inline-table tr:last-child td').text().trim();
            const bandeira = $(element).find('td.zentriert img').attr('src');
            const valor = $(element).find('td.rechts.hauptlink a').text().trim();

            // Adiciona os dados do jogador ao array
            jogadores.push({
                nome,
                posicao,
                bandeira,
                valor
            });
        });

        return jogadores.length > 0 ? jogadores : 'Nenhum dado encontrado';
    } catch (error) {
        console.error('Erro ao acessar a página:', error);
        return 'Erro ao acessar a página';
    }
}

// Função para enviar e-mail
async function sendEmail(to, subject, body) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'faculdadea30@gmail.com', // Seu e-mail
            pass: 'jvxy yyth jvyc qxhk', // App Password
        },
    });

    // Configurações do e-mail
    const mailOptions = {
        from: 'faculdadea30@gmail.com',
        to: to,
        subject: subject,
        text: body,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
}

// Função principal
async function main() {
    const url = 'https://www.transfermarkt.com.br/serie-a/marktwerte/wettbewerb/BRA1'; // URL da página a ser scrapada
    const scrapedData = await scrapeData(url);

    // Formata os dados para uma string
    const formattedData = scrapedData.map(jogador => {
        return `Nome: ${jogador.nome}\nPosição: ${jogador.posicao}\nBandeira: ${jogador.bandeira}\nValor: ${jogador.valor}\n\n`;
    }).join('');

    // Enviar e-mail
    await sendEmail('brendofcg.2013@gmail.com', 'Dados Scrapados', formattedData);
}

// Executa a função principal
main();
