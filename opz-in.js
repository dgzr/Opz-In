/**
Author : aditia_dtz © 2020
Date : Mon Nov 30 18:35:21 WIB 2020
iseng ae buat nambah pengetahuan.,-
**/
const cheerio = require('cheerio');
const readline = require('readline');
const request = require('request');

const prompt = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

var blue = "\033[34m";
var white = "\033[37m";
var red = "\033[31m";
var banner = (`
   ∧＿∧
（｡･ω･｡)つ━☆    OploVerz.In cli version
 ⊂　　 /           aditia_dtz © 2020
.:しーＪ
`);

function clear(){
	'use strict';
	process.stdout.write('\x1Bc');
}

function Menu(){
	clear();console.log(banner);
	console.log(` ${blue}~${red}! ${white}by aditia_dtz © 2020

 ${blue}[${white}01${blue}]${white} Home
 ${blue}[${white}02${blue}]${white} Search Anime
 ${blue}[${white}03${blue}]${white} More Information
 ${blue}[${white}00${blue}]${white} Exit Tools!
`);
	prompt.question(' >>> ',(cos) => {
		if(cos == ''){
			Err(" Can't process none choice");
		} else if(cos == 1 || cos == 01){
			HttpPage(
				"https://www.oploverz.in/", (result) => {
					getTitle(result);
				});
		} else if(cos == 2 || cos == 02){
			clear();console.log(banner);console.log(` ${blue}~${red}!${white} Anime Search \n`);
			prompt.question(' >>> ',(ttl) => {
				if(ttl == ''){
					Err(" Can't process none title input!");
				} else {
					HttpPage(
						`https://www.oploverz.in/?s=${ttl.replace(/\s+/g,'+')}&post_type=post`, (result) => {
							getTitle(result);
						});
				}
			});
		} else if(cos == 3 || cos == 03){
			console.log(`${white} Contact ${blue}=>${white} https://t.me/aditia_dtz`);process.exit(1);
		} else if(cos == 0 || cos == 00){
			process.exit(1);
		} else {
			Err(" Invalid Choice!");
		}
	});
}

function HttpPage(url, callback){
	request({
		headers: { "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"},
		url: `${url}`,
	},(err,resp,html) => {
		if(!err && resp.statusCode == 200){
			callback(html);
		} else {
			throw err;
		}
	});
}

function getTitle(page){
	var info = [];
	var next = [];
	var prev = [];
	const $ = cheerio.load(page);
	console.clear();console.log(banner);console.log(`\t${$('title').html()}\n`);
	$('div[class="dtl"]').each((i,e) => {
		var pg = $(e);
		info.push(pg.find('a').attr('href'));
		console.log(` ${white}${i+1}${blue}).${white} ${$(e).find('h2').text()}`);
	}); $('a[class="nextpostslink"]').each((i,e) => {
			next.push($(e).attr('href'));
		}); $('a[class="previouspostslink"]').each((i,e) => {
				prev.push($(e).attr('href'));
			}); if(prev.length !== 0 || next.length !== 0){
					console.log(`\n\t\t ${white}Type ${blue}[${white}N${blue}]${white} For Next Type ${blue}[${white}P${blue}]${white} For Prev `);
				} if(info.length == 0){
					console.log(`			~(‾▿‾~)

		Can't Find Anime Title`);process.exit(1);
				};prompt.question(' >>> ',(cos) => {
					if((cos-1) < info.length){
						HttpPage(
							info[cos-1],(result) => {
								Download(result);
							});
					} else if(cos == "N" || cos == 'n'){
						if(next.length !== 0){
							HttpPage(
								next[0], (result) => {
									getTitle(result);
								});
						} else {
							Err(" Can Not next last pages!");
						}
					} else if(cos == "P" || cos == "p"){
						if(prev.length !== 0){
							HttpPage(
								prev[0], (result) => {
									getTitle(result);
								});
						} else {
							Err(" Can Not Previous First pages!");
						}
					} else {
						Err(' Invalid Choice!');
					}
				});
}

function Download(page){
	var data = [];
	var server = [];
	var link = [];
	var no_server = [];
	console.clear();console.log(banner);
	const $ = cheerio.load(page);
	$('div[class="sorattl title-download"]').each((i,e) => {
		console.log(` ${white}${i+1}${blue}). ${white}${$(e).text()}`);
	}); $('div[class="soraurl list-download"]').each((i,e) => {
			no_server.push($(e).html());
		}); prompt.question('\n >>> ',(cos) => {
				if((cos-1) < no_server.length){
					console.log(`\t\t   ${blue}[ ${white}Server list ${blue}] ${blue}\n`);
					const $ = cheerio.load(no_server[cos-1]);
					$('a').each((i,e) => {
						server.push($(e).text());
						link.push($(e).attr('href'));
					}); server.forEach((i,e) => {
							console.log(` ${white}${e+1}${blue}).${white} ${i} ${blue}>>${white} ${link[e]}`)
						});
				}
			prompt.close();
			});
}

function Err(msg){
	var err = new Error(msg);
	throw err;
}

Menu();
