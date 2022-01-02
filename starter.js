
var app = new Vue({
  el: '#app',
  data: {
    message: 'Привет, Vue!',
    person: {
      name: '',
      race: 'Человек',
      class: 'воин',
      wearponCategory: 'выберите класс',
      equipment: {
        rightHand: null,
      },
      attack: '2d2',
      characteristics: {
        str: 10,
        dex: 10,
        con: 10,
        wis: 10,
        int: 10,
        chr: 10,
        },
    },
    bonuses: {
        pointsMax: 20,
        points: 20 ,
        int: 0,
        str: 0, 
        dex: 0,
        con: 0,
        wis: 0,
        chr: 0,

    },
    tempValue: {
        int: 0,
        str: 0, 
        dex: 0,
        con: 0,
        wis: 0,
        chr: 0,
        race: 0,
        classes: [],
        wearponsloadedForChoose: [],
        equipmentForChoose: [],
    },
    genders: [
          { gender: 'Мужчина', bonus: '' },
          { gender: 'Женщина', bonus: '' }
        ],
    races: [
          { race: 'Человек', class: ['воин', 'священник', 'маг'], bonus: 'int+2' },
          { race: 'Орк', class: ['воин', 'священник'], bonus: 'str+2' }
        ],
    classes: [
          {name: 'воин', wearponCategory: ['топор', 'меч', 'двуручный меч','посох'], abilities: []},
          {name: 'маг', wearponCategory: ['посох'], abilities: ['mageBook']},
          {name: 'священник', wearponCategory: ['посох', 'булава'], abilities: ['mageBook']}
        ]
  },
  created: function() {
      requestWearpon = 'json/wearpons.json';
      requestWrp = new XMLHttpRequest();
      requestWrp.open('GET', requestWearpon);
      requestWrp.responseType = 'json';
      requestWrp.send();
      requestWrp.onload = () => {
        wearponsloaded = requestWrp.response;
        this.tempValue.wearponsloadedForChoose = wearponsloaded;
      };

      requestGloves = 'json/gloves.json';
      requestGl = new XMLHttpRequest();
      requestGl.open('GET', requestGloves);
      requestGl.responseType = 'json';
      requestGl.send();
      requestGl.onload = () => {
        gloves = requestGl.response;
        this.tempValue.wearponsloadedForChoose = gloves;
      }
  },
  computed: {
    summaryPoints: function () {
      summaryValue = parseInt(this.bonuses.pointsMax) - parseInt(this.bonuses.int) - parseInt(this.bonuses.str) - parseInt(this.bonuses.dex)
       - parseInt(this.bonuses.con) - parseInt(this.bonuses.wis) - parseInt(this.bonuses.chr);
      if (summaryValue<0) {
        this.bonuses.int =  this.tempValue.int;
        this.bonuses.str =  this.tempValue.str;
        this.bonuses.con =  this.tempValue.con;
        this.bonuses.dex =  this.tempValue.dex;
        this.bonuses.wis =  this.tempValue.wis;
        this.bonuses.chr =  this.tempValue.chr;
        this.bonuses.points = parseInt(this.bonuses.pointsMax) - parseInt(this.bonuses.int) - parseInt(this.bonuses.str) 
        - parseInt(this.bonuses.con) - parseInt(this.bonuses.wis) - parseInt(this.bonuses.chr) - parseInt(this.bonuses.dex);
        return this.bonuses.points;
      }
      if (this.bonuses.points>this.bonuses.pointsMax) {
        this.bonuses.int =  parseInt(this.tempValue.int)+1;
        this.bonuses.str =  parseInt(this.tempValue.str)+1;
        this.bonuses.con =  parseInt(this.tempValue.con)+1;
        this.bonuses.wis =  parseInt(this.tempValue.wis)+1;
        this.bonuses.dex =  parseInt(this.tempValue.dex)+1;
        this.bonuses.chr =  parseInt(this.tempValue.chr)+1;
        this.bonuses.points = parseInt(this.bonuses.pointsMax)-1;
        summaryValue = this.bonuses.pointsMax;
        return summaryValue;
      }
      this.person.characteristics.int = parseInt(this.person.characteristics.int) + parseInt(this.bonuses.int) - parseInt(this.tempValue.int);
      this.tempValue.int = parseInt(this.bonuses.int);
      this.person.characteristics.str = this.person.characteristics.str + parseInt(this.bonuses.str) - parseInt(this.tempValue.str);
      this.tempValue.str = this.bonuses.str;
      this.person.characteristics.con = this.person.characteristics.con + parseInt(this.bonuses.con) - parseInt(this.tempValue.con);
      this.tempValue.con = this.bonuses.con;
      this.person.characteristics.dex = this.person.characteristics.dex + parseInt(this.bonuses.dex) - parseInt(this.tempValue.dex);
      this.tempValue.dex = this.bonuses.dex;
      this.person.characteristics.wis = this.person.characteristics.wis + parseInt(this.bonuses.wis) - parseInt(this.tempValue.wis);
      this.tempValue.wis = this.bonuses.wis;
      this.person.characteristics.chr = this.person.characteristics.chr + parseInt(this.bonuses.chr) - parseInt(this.tempValue.chr);
      this.tempValue.chr = this.bonuses.chr;
      this.bonuses.points = summaryValue;
      return this.bonuses.points;
    }, 
  },
  methods: {
    changePerson: function (bonus) {
      bonusesArr = bonus.split(',');
      for (i = 0; i < bonusesArr.length; ++i) {
        bonusesItem = bonusesArr[i];
        if (bonusesItem.split('+').length == 2){
          bonusesItemArr = bonusesItem.split('+');
          //this.person.characteristics[bonusesItemArr[0]] = parseInt(this.person.characteristics[bonusesItemArr[0]]) + parseInt(bonusesItemArr[1]);
          //this.tempValue.race = bonusesItemArr;
        };
        if (bonusesItem.split('-').length == 2){
          this.person.characteristics[bonusesItem[0]] + bonusesItem[1];
        };
      };
      return;
    },
    /*
    * parametr - наименование ресурса откуда брать бонус
    * races, gender etc
    * key - ключ-значение по которому определяется бонус
    * getBonus('races', 'человек')
    * return string bonus 
    */
    getBonus: function (parametrs, key) {
      bonus = null;
      parametr = parametrs.slice(0,-1);
      for (prop in this[parametrs]) {
        if (this[parametrs][prop][parametr] == key) {
          bonus = this[parametrs][prop]['bonus'];
        }
      };
      return bonus;
      
    },
    /*
    * Функция переключает все статусы персонажа при смене класса
    */
    changeClass: function () {
      selectedRace = this.races.filter(races => races.race == this.person.race);
      classes = selectedRace[0]['class'];
      this.tempValue['classes'] = classes;
      selectedWearponType = this.classes.filter(classes => classes.name == this.person.class);
      this.person.wearponCategory = selectedWearponType[0]['wearponCategory'];
      //console.log(this.tempValue.wearponsloadedForChoose);
      //wearponCategoryNameArray = this.tempValue.wearponsloadedForChoose;
      /*
      for (let key in this.person.wearponCategory) {
        if (this.tempValue.wearponsloadedForChoose.hasOwnProperty(this.person.wearponCategory[key])) {
            console.log(this.tempValue.wearponsloadedForChoose[this.person.wearponCategory[key]]);
              equipmentForLoad = this.tempValue.wearponsloadedForChoose[this.person.wearponCategory[key]];
              for (let key2 in equipmentForLoad) {
                this.tempValue.equipmentForChoose[this.person.wearponCategory[key]][key2] = equipmentForLoad[key2];
                console.log(typeof(this.tempValue.equipmentForChoose));
                console.log('в ');
                console.log(this.tempValue.equipmentForChoose);
                console.log(' было добавлено ');
                console.log(equipmentForLoad[key2]);
              }
        }
      }
      console.log('полученный массив ');
      console.log(this.tempValue.equipmentForChoose);
      */
    },
    loadInEqupmentForChoose: function (typeEqName) {
      //Проверяем загруженные файлы на наличии свойсва typeEqName
      this.tempValue.equipmentForChoose[typeEqName] = [];
      let arrayTemp = [];
      if (this.tempValue.wearponsloadedForChoose[typeEqName] !== undefined) {
        console.log('сработал');
        for(let key in this.person.wearponCategory) {
          nameOfTeg = this.person.wearponCategory[key];
          if (this.tempValue.wearponsloadedForChoose[typeEqName][nameOfTeg] != undefined) {
            for (let key2 in this.tempValue.wearponsloadedForChoose[typeEqName][nameOfTeg]) {
              console.log(this.tempValue.wearponsloadedForChoose[typeEqName][nameOfTeg][key2]);
             // arrayTemp = arrayTemp.push(this.tempValue.wearponsloadedForChoose[typeEqName][nameOfTeg][key2]);
            } 
          }
          this.tempValue.equipmentForChoose = arrayTemp;
        }
      }
    },

  },


})
