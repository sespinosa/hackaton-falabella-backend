var recastai = require('recastai').default;
var axios = require('axios');

class recast {
    constructor(){
        this.requestToken = '6d097815dba1cc0e6c946e9080ffa40a';

        /**
         * Repuestas predefinidas del BOT utilizar con getRandomInt();
         * example = agendarReponseNotTime[getRandomInt(0,agendarReponseNotTime.length)]
         */
        this.defauldResponse = [
            'No entiendo muy bien tu pregunta, tal vez no me han configurado para esto.',
            'Por el momento no puedo entenderte, pero puedes preguntarme que hacer para mostrarte mis capacidades.',
            'No puedo entenderte, mis capacidades son limitadas :('
        ];

        this.greetingsResponse = [
            'Hola mi nombre es Cecilia, preguntame lo que puedes hacer',
            'Hola, Soy Cecilia, el ayudate virtual para tus compras',
            'Hola, dime en que te puedo ayudar.'
        ];

        this.creatorResponse = [
            'Mis Creadores son un equipo que se conformo en la hackathon de falabella',
            'Vengo de una internet muy lejana y no te puedes imaginar con que tecnologia estoy programado!!! :D',
        ]

        this.feelingsResponse = [
            'Estoy muy bien gracias',
            'Mis bytes estan desordenados.',
            'Tengo un corto circuito que no me permite estar al 100% de funcionamiento',
            'Creo que mis ram estan trabajando mucho, asi que me siento algo cansado.'
        ];

        this.productResponseNodetails = [
            'Si claro, categoría de producto buscas?',
            'Claro, me puedes nombrar el producto o darme el ID de la web.',
            'Claro!, te puedo recomendar buscar calzado,poleras,pantalones tu elije!.'
        ]

    }

/*     requestIntencion(text){
        const requestToken = this.requestToken
        const client = new recastai(requestToken);
        return client.request.converseText(text)
        .then((res) => {
            var slug = 'defauld';
            if(res.intents.length > 0){
                slug = res.intents[0].slug;
            }
            console.log('Tipo Pregunta : ' + slug);
            return this.responseIntents(slug, res)
              .then(function(json) {
                  console.log('###############')
                  console.log(json)
                  console.log('###############')
                return {'json' : json, 'res': res};
              })
              .catch(function(e) { console.log(e) })

        }).catch((error) => {
            return error
        })
    } */

    requestIntencion(text) {
        const client = new recastai(this.requestToken)
        return client.request.converseText(text)
            .then(res => {
                let slug = 'defauld'
                if(res.intents.length > 0) {
                    slug = res.intents[0].slug
                }
                return this.responseIntents(slug, res)
            })
            .then((json, res) => ({json, res}))
            .catch(e => console.log(e))
    }

    requestEntities(text){
        const client = new recastai(requestToken);
        client.request.converseText(text)
        .then((res) => {
            if(res.entities.length > 0){
                return res.entities;
            }else{
                return false;
            }
        }).catch((error) => {
            return error;
        })
    }

    responseIntents(intents,res){


        console.log('########################')
        console.log('########################')
        console.log(res.entities)
        console.log('########################')
        console.log('########################')


        switch (intents){
            case 'product_info':
                if(typeof res.entities.produc_id  !== 'undefined'){
                    return this.getProductApibyId(res.entities.produc_id[0].value);
                }else{
                    return new Promise((resolve, reject) => {
                        var json = {'response': this.productResponseNodetails[this.getRandomInt(0,this.productResponseNodetails.length)],'data':''};
                        resolve(json, res)
                    })
                }
                break;
            case 'product_list':
                if(typeof parseInt(res.entities.category) !== 'undefined'){
                    return this.getProductApibyTerm(res.entities.category[0].value);
                }else{
                    return new Promise((resolve, reject) => {
                        var json = { 'response': this.productResponseList[this.getRandomInt(0,this.productResponseList.length)],'data':'' };
                        resolve(json, res)
                    })
                }
                break;
            case 'add_to_cart':
                if(typeof res.entities.product_name !== 'undefined'){
                    return  this.getProductApibyTerm(res.entities.product_name[0].value);
                }else{
                    return new Promise((resolve, reject) => {
                        var json = { 'response': 'Dime que quieres agregar al carro.','data':''}
                        resolve(json, res)
                    })
                }
                break;
            default:
                return new Promise((resolve, reject) => {
                    var json = {'response': this.defauldResponse[this.getRandomInt(0,this.defauldResponse.length)], 'data': ''};
                    resolve(json, res)
                })
                break;
        }
    }


    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getProductApibyId(product_id){
        return new Promise(function(resolve, reject) {
            axios.get('http://www.falabella.com/falabella-cl/product/' + product_id + '/?format=json')
            .then(function (response) {
              console.log(response.data); //contents[0].mainSection[0].contents[0].JSON
              var json = {
                  'response' : 'He encontrado ' + response.data.contents[0].mainSection[0].contents[0].JSON + ' productos que te pueden interesar' ,
                  'data' : response.data.contents[0].mainSection[0].contents[0].JSON
                };
              console.log(json)
              resolve(json);
            })
            .catch(function (error) {
              console.log(error);
              reject('No he logrado encontrar tu producto.')
            });
        })
    }

    getProductApibyTerm(search){
        return new Promise(function(resolve, reject) {
            axios.get('http://www.falabella.com/falabella-cl/search/?Ntt=' + search + '&format=json')
            .then(function (response) {
              //console.log(response.data.contents[0].mainSection[1].contents[0].JSON); //.mainSection[0].contents[0].JSON.product
              //console.log(response);
              var json = {
                  'response' : 'He encontrado ' + response.data.contents[0].mainSection[1].contents[0].JSON.searchItemList.resultsTotal + 'Productos...' ,
                  'data' : response.data.contents[0].mainSection[1].contents[0].JSON.searchItemList.resultList
                };
              resolve(json);
            })
            .catch(function (error) {
              console.log(error);
              reject('No he logrado encontrar tu producto.')
            });
        })
    }

}

export default recast