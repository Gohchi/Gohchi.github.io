
import { createApp, onMounted } from 'vue';
import { getAPI } from '/modules/Tools.js';
import cards from './cards.json' assert {type: 'json'};

console.log(cards);
createApp({
  components: {
  },
  methods: {
    check() {
      console.log(this);
    },
    getLevelOrRank( { type } ) {
      return !type ? '-none'
        : type.includes('Xyz') ? '-rank'
        : '-level';
    },
    getBGByType( card ) {
      if( !card ) return '-none';
      const { type, card_type } = card;
      const cardType = (type ?? card_type).toLowerCase();
      return cardType.includes('fusion') ? '-fusion'
        : cardType.includes('xyz') ? '-xyz'
        : cardType.includes('synchro') ? '-synchro'
        : cardType.includes('ritual') ? '-ritual'
        : cardType.includes('trap') ? '-trap'
        : cardType.includes('spell') ? '-spell'
        : cardType.includes('pendulum') ? '-pendulum'
        : cardType.includes('effect') ? '-effect'
        : cardType.includes('normal') ? '-normal'
        : '-token';
    },
    selectCard( card ) {
      if( this.selectedCard === card )
        return;

      this.getCardImage( card );
      this.getCardPrices( card );

      this.selectedCard = undefined;
      this.selectedCardData = undefined;

      setTimeout(() => {
        this.selectedCard = card;
      }, 0);

      getAPI('yugiohprices.com/api/card_data/' + card.name)
        .then( ({ data }) => {
          console.log(data);
          
          if(!data) return;
          
          this.selectedCardData = data;
          setTimeout(() => {
            this.$refs.textRef.innerText = data.text;
          }, 0);
        } );
    },
    getCardImage( card ) {
      this.selectedCardImage = undefined;
      this.cardImageIsLoading = true;
      getAPI('yugiohprices.com/api/card_image/' + card.name, 'image')
        .then( ( blob ) => {
          this.selectedCardImage = URL.createObjectURL(blob);
          this.cardImageIsLoading = false;
        } );
    },
    getCardPrices( card ) {
      this.selectedCardPrices = undefined;
      getAPI('yugiohprices.com/api/get_card_prices/' + card.name)
        .then( ( { data } ) => {
          this.selectedCardPrices = data;
        } );
    }
  },
  // setup() {
  //   return {
  //     cardRef: ref([]),
  //     textRef: ref({})
  //   };
  // },
  mounted() {
    /* Options API */
    // getAPI(
    //   //'http://ip-api.com/json'
    //   'yugiohprices.com/api/get_card_prices/Raigeki',
    //   //'yugiohprices.com/api/price_for_print_tag/PSV-000',
    // )
    // .then( ({ data }) => {
    //   console.log(data);
    //   this._.setupState.cardRef.value = data;
    // } );
  },
  data() {
    return {
      cards: cards,
      selectedCard: undefined,
      selectedCardData: undefined,
      selectedCardImage: undefined,
      cardImageIsLoading: false,
      showCredits: window.innerWidth > 1200,
      // selectedCardPrices: undefined,
      selectedCardPrices: [
{
"name": "Ra Yellow Mega Pack",
"print_tag": "RYMP-EN058",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 11.73,
      "low": 0.25,
      "average": 1.49,
      "shift": 0.0875912408759124,
      "shift_3": 0,
      "shift_7": 0,
      "shift_21": -0.0132450331125828,
      "shift_30": -0.0261437908496732,
      "shift_90": -0.0132450331125828,
      "shift_180": 0.0875912408759124,
      "shift_365": 0.173228346456693,
      "updated_at": "2023-04-01 13:44:04 -0400"
    }
  }
}
},
{
"name": "Starter Deck: Xyz Symphony",
"print_tag": "YS12-EN011",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 4.19,
      "low": 0.25,
      "average": 1.39,
      "shift": 0,
      "shift_3": 0,
      "shift_7": -0.0794701986754967,
      "shift_21": -0.0608108108108108,
      "shift_30": -0.0794701986754967,
      "shift_90": -0.0671140939597315,
      "shift_180": -0.027972027972028,
      "shift_365": -0.0608108108108108,
      "updated_at": "2023-04-01 13:44:08 -0400"
    }
  }
}
},
{
"name": "Cyber Dragon Revolution Structure Deck",
"print_tag": "SDCR-EN003",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 2.16,
      "low": 0.25,
      "average": 1.45,
      "shift": 0,
      "shift_3": 0,
      "shift_7": 0.0984848484848485,
      "shift_21": -0.0333333333333333,
      "shift_30": 0,
      "shift_90": -0.00684931506849315,
      "shift_180": 0.0902255639097744,
      "shift_365": -0.42,
      "updated_at": "2023-04-01 15:30:14 -0400"
    }
  }
}
},
{
"name": "Starter Deck: Link Strike",
"print_tag": "YS17-EN008",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 4.19,
      "low": 0.25,
      "average": 1.33,
      "shift": -0.00746268656716418,
      "shift_3": -0.00746268656716418,
      "shift_7": -0.0291970802919708,
      "shift_21": -0.089041095890411,
      "shift_30": 0.0152671755725191,
      "shift_90": 0.00757575757575758,
      "shift_180": -0.193939393939394,
      "shift_365": 0.117647058823529,
      "updated_at": "2023-04-01 15:30:50 -0400"
    }
  }
}
},
{
"name": "Egyptian God Deck: Obelisk the Tormentor",
"print_tag": "EGO1-EN009",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 4.19,
      "low": 0.25,
      "average": 2.18,
      "shift": 0,
      "shift_3": -0.00909090909090909,
      "shift_7": 0.463087248322148,
      "shift_21": 0.159574468085106,
      "shift_30": 0.503448275862069,
      "shift_90": 0.260115606936416,
      "shift_180": 0.337423312883436,
      "shift_365": 0.579710144927536,
      "updated_at": "2023-04-01 15:31:32 -0400"
    }
  }
}
},
{
"name": "Speed Duel GX: Duelists of Shadows",
"print_tag": "SGX3-ENI28",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 1.99,
      "low": 0.25,
      "average": 1.44,
      "shift": 0.0666666666666667,
      "shift_3": 0.0510948905109489,
      "shift_7": -0.859785783836417,
      "shift_21": 0,
      "shift_30": 0,
      "shift_90": 0,
      "shift_180": 0,
      "shift_365": 0,
      "updated_at": "2023-04-01 15:33:17 -0400"
    }
  }
}
},
{
"name": "Saber Force Starter Deck",
"print_tag": "YS15-ENF05",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 5.49,
      "low": 0.3,
      "average": 1.43,
      "shift": 0,
      "shift_3": 0.0141843971631206,
      "shift_7": 0.0141843971631206,
      "shift_21": 0,
      "shift_30": 0.00704225352112676,
      "shift_90": 0.0141843971631206,
      "shift_180": 0.0592592592592593,
      "shift_365": -0.25130890052356,
      "updated_at": "2023-04-01 15:33:24 -0400"
    }
  }
}
},
{
"name": "Machina Mayhem Structure Deck",
"print_tag": "SDMM-EN013",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 4.63,
      "low": 0.35,
      "average": 1.55,
      "shift": -0.00641025641025641,
      "shift_3": 0,
      "shift_7": -0.00641025641025641,
      "shift_21": -0.0189873417721519,
      "shift_30": -0.049079754601227,
      "shift_90": -0.0251572327044025,
      "shift_180": 0.0915492957746479,
      "shift_365": 0.201550387596899,
      "updated_at": "2023-04-01 13:43:57 -0400"
    }
  }
}
},
{
"name": "Legendary Dragon Decks",
"print_tag": "LEDD-ENB01",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 4.1,
      "low": 0.35,
      "average": 1.32,
      "shift": 0,
      "shift_3": 0.00763358778625954,
      "shift_7": -0.0638297872340425,
      "shift_21": 0.0153846153846154,
      "shift_30": 0.0153846153846154,
      "shift_90": 0.0153846153846154,
      "shift_180": 0.0731707317073171,
      "shift_365": -0.131578947368421,
      "updated_at": "2023-04-01 15:31:04 -0400"
    }
  }
}
},
{
"name": "Speed Duel GX: Duel Academy Box",
"print_tag": "SGX1-ENG01",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 5.24,
      "low": 0.35,
      "average": 1.34,
      "shift": 0,
      "shift_3": -0.0884353741496599,
      "shift_7": -0.0694444444444444,
      "shift_21": -0.100671140939597,
      "shift_30": -0.0147058823529412,
      "shift_90": -0.00740740740740741,
      "shift_180": 0.0307692307692308,
      "shift_365": -0.733598409542744,
      "updated_at": "2023-04-01 15:33:05 -0400"
    }
  }
}
},
{
"name": "Battle Pack: Epic Dawn",
"print_tag": "BP01-EN138",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 6.39,
      "low": 0.49,
      "average": 1.49,
      "shift": -0.0261437908496732,
      "shift_3": -0.00666666666666667,
      "shift_7": -0.00666666666666667,
      "shift_21": -0.00666666666666667,
      "shift_30": -0.0132450331125828,
      "shift_90": -0.0324675324675325,
      "shift_180": -0.0261437908496732,
      "shift_365": 0.173228346456693,
      "updated_at": "2023-04-01 13:44:10 -0400"
    }
  }
}
},
{
"name": "Battle Pack 2: War of the Giants",
"print_tag": "BP02-EN039",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 5.49,
      "low": 0.49,
      "average": 1.59,
      "shift": 0,
      "shift_3": -0.00625,
      "shift_7": 0,
      "shift_21": -0.0245398773006135,
      "shift_30": -0.00625,
      "shift_90": -0.0245398773006135,
      "shift_180": 0.096551724137931,
      "shift_365": 0.282258064516129,
      "updated_at": "2023-04-01 15:29:53 -0400"
    }
  }
}
},
{
"name": "Starter Deck: Codebreaker",
"print_tag": "YS18-EN014",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 5.49,
      "low": 0.49,
      "average": 1.34,
      "shift": 0,
      "shift_3": 0,
      "shift_7": 0,
      "shift_21": -0.0945945945945946,
      "shift_30": -0.106666666666667,
      "shift_90": -0.242937853107345,
      "shift_180": -0.141025641025641,
      "shift_365": 0.145299145299145,
      "updated_at": "2023-04-01 15:31:15 -0400"
    }
  }
}
},
{
"name": "OTS Tournament Pack 11",
"print_tag": "OP11-EN013",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 5.25,
      "low": 0.49,
      "average": 1.34,
      "shift": 0,
      "shift_3": -0.0629370629370629,
      "shift_7": -0.049645390070922,
      "shift_21": 0.0075187969924812,
      "shift_30": 0.0151515151515152,
      "shift_90": -0.238636363636364,
      "shift_180": -0.1625,
      "shift_365": 0.135593220338983,
      "updated_at": "2023-04-01 15:31:22 -0400"
    }
  }
}
},
{
"name": "Structure Deck: Cyber Strike",
"print_tag": "SDCS-EN003",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 5.4,
      "low": 0.49,
      "average": 2.25,
      "shift": 0,
      "shift_3": -0.0174672489082969,
      "shift_7": 0.0227272727272727,
      "shift_21": 0.113861386138614,
      "shift_30": 0.136363636363636,
      "shift_90": 0.196808510638298,
      "shift_180": 0.25,
      "shift_365": 1.52808988764045,
      "updated_at": "2023-04-01 15:33:01 -0400"
    }
  }
}
},
{
"name": "2-Player Starter Deck: Yuya & Declan",
"print_tag": "YS15-ENY04",
"rarity": "Common",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 0.99,
      "low": 0.99,
      "average": 0.99,
      "shift": 0,
      "shift_3": 0,
      "shift_7": -0.853550295857988,
      "shift_21": 0,
      "shift_30": 0,
      "shift_90": 0,
      "shift_180": -0.815985130111524,
      "shift_365": -0.887115165336374,
      "updated_at": "2023-04-01 15:33:27 -0400"
    }
  }
}
},
{
"name": "Collectible Tins 2006 Wave 1",
"print_tag": "CT03-EN002",
"rarity": "Secret Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 320,
      "low": 1,
      "average": 16.39,
      "shift": 1.05388471177945,
      "shift_3": 0.0161190328580285,
      "shift_7": 0.026299311208516,
      "shift_21": -0.692033070274333,
      "shift_30": 0.0622164614387557,
      "shift_90": -0.563631522896699,
      "shift_180": 0.0574193548387097,
      "shift_365": -0.1805,
      "updated_at": "2023-04-01 13:43:51 -0400"
    }
  }
}
},
{
"name": "Battles of Legend: Relentless Revenge",
"print_tag": "BLRR-EN048",
"rarity": "Ultra Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 7.27,
      "low": 1.18,
      "average": 3.55,
      "shift": -0.0508021390374332,
      "shift_3": 0.0201149425287356,
      "shift_7": -0.0273972602739726,
      "shift_21": 0.0201149425287356,
      "shift_30": 0.0113960113960114,
      "shift_90": 0.0056657223796034,
      "shift_180": 0.215753424657534,
      "shift_365": -0.0779220779220779,
      "updated_at": "2023-04-01 15:31:10 -0400"
    }
  }
}
},
{
"name": "Battle Pack: Epic Dawn",
"print_tag": "BP01-EN138",
"rarity": "Starfoil Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 10,
      "low": 1.19,
      "average": 1.52,
      "shift": -0.0065359477124183,
      "shift_3": -0.0065359477124183,
      "shift_7": -0.0065359477124183,
      "shift_21": 0,
      "shift_30": 0,
      "shift_90": -0.012987012987013,
      "shift_180": -0.609254498714653,
      "shift_365": -0.276190476190476,
      "updated_at": "2023-04-01 13:44:11 -0400"
    }
  }
}
},
{
"name": "Battle Pack 2: War of the Giants",
"print_tag": "BP02-EN039",
"rarity": "Mosaic Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 5.49,
      "low": 1.19,
      "average": 1.43,
      "shift": 0,
      "shift_3": -0.0137931034482759,
      "shift_7": -0.065359477124183,
      "shift_21": -0.0833333333333333,
      "shift_30": -0.0774193548387097,
      "shift_90": -0.089171974522293,
      "shift_180": -0.0137931034482759,
      "shift_365": -0.558641975308642,
      "updated_at": "2023-04-01 15:30:05 -0400"
    }
  }
}
},
{
"name": "Hidden Arsenal: Chapter 1",
"print_tag": "HAC1-EN014",
"rarity": "Duel Terminal Ultra Parallel Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 5.38,
      "low": 1.19,
      "average": 1.85,
      "shift": 0,
      "shift_3": 0.0109289617486339,
      "shift_7": -0.0263157894736842,
      "shift_21": -0.0512820512820513,
      "shift_30": -0.031413612565445,
      "shift_90": -0.0364583333333333,
      "shift_180": -0.271653543307087,
      "shift_365": -0.405144694533762,
      "updated_at": "2023-04-01 15:33:03 -0400"
    }
  }
}
},
{
"name": "Speed Duel GX: Duelists of Shadows",
"print_tag": "SGX3-ENI28",
"rarity": "Secret Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 1.99,
      "low": 1.2,
      "average": 1.44,
      "shift": -0.562310030395137,
      "shift_3": -0.622047244094488,
      "shift_7": -0.906735751295337,
      "shift_21": 0,
      "shift_30": 0,
      "shift_90": 0,
      "shift_180": 0,
      "shift_365": 0,
      "updated_at": "2023-04-01 15:33:19 -0400"
    }
  }
}
},
{
"name": "Speed Duel GX: Duel Academy Box",
"print_tag": "SGX1-ENG01",
"rarity": "Secret Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 5.24,
      "low": 1.22,
      "average": 1.34,
      "shift": 0,
      "shift_3": 0,
      "shift_7": -0.0821917808219178,
      "shift_21": -0.100671140939597,
      "shift_30": -0.0147058823529412,
      "shift_90": -0.00740740740740741,
      "shift_180": 0.0307692307692308,
      "shift_365": -0.760286225402504,
      "updated_at": "2023-04-01 15:33:08 -0400"
    }
  }
}
},
{
"name": "Cybernetic Revolution",
"print_tag": "CRV-EN015",
"rarity": "Super Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 950,
      "low": 1.87,
      "average": 7.42,
      "shift": 0.294938917975567,
      "shift_3": 0.0363128491620112,
      "shift_7": 0.0495049504950495,
      "shift_21": 0.469306930693069,
      "shift_30": 0.069164265129683,
      "shift_90": 0.424184261036468,
      "shift_180": -0.341030195381883,
      "shift_365": -0.494550408719346,
      "updated_at": "2023-04-01 13:43:48 -0400"
    }
  }
}
},
{
"name": "Cybernetic Revolution",
"print_tag": "CRV-EN015",
"rarity": "Ultimate Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 10149.98,
      "low": 1.87,
      "average": 4.97,
      "shift": 0.0122199592668024,
      "shift_3": 0.00607287449392713,
      "shift_7": 0.00201612903225806,
      "shift_21": -0.0569259962049336,
      "shift_30": -0.140138408304498,
      "shift_90": -0.0235756385068762,
      "shift_180": 0.577777777777778,
      "shift_365": -0.971502293577982,
      "updated_at": "2023-04-01 13:43:49 -0400"
    }
  }
}
},
{
"name": "Legendary Collection 2: The Duel Academy Years Mega Pack",
"print_tag": "LCGX-EN175",
"rarity": "Ultra Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 36.84,
      "low": 1.98,
      "average": 4.88,
      "shift": 0.0166666666666667,
      "shift_3": -0.0121457489878543,
      "shift_7": 0.145539906103286,
      "shift_21": 0.082039911308204,
      "shift_30": 0.124423963133641,
      "shift_90": 0.14018691588785,
      "shift_180": 0.22,
      "shift_365": -0.186666666666667,
      "updated_at": "2023-04-01 13:43:58 -0400"
    }
  }
}
},
{
"name": "Duelist Saga",
"print_tag": "DUSA-EN057",
"rarity": "Ultra Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 21.97,
      "low": 2.37,
      "average": 3.87,
      "shift": -0.104166666666667,
      "shift_3": 0.0211081794195251,
      "shift_7": 0.0292553191489362,
      "shift_21": 0.0347593582887701,
      "shift_30": 0.105714285714286,
      "shift_90": 0.138235294117647,
      "shift_180": 0.102564102564103,
      "shift_365": 0.16566265060241,
      "updated_at": "2023-04-01 15:30:39 -0400"
    }
  }
}
},
{
"name": "Premium Gold",
"print_tag": "PGLD-EN053",
"rarity": "Gold Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 10.98,
      "low": 2.99,
      "average": 5.02,
      "shift": 0.04375,
      "shift_3": 0.04375,
      "shift_7": 0.0459290187891441,
      "shift_21": 0.0659574468085106,
      "shift_30": 0.04375,
      "shift_90": 0.0121212121212121,
      "shift_180": -0.0670391061452514,
      "shift_365": -0.25,
      "updated_at": "2023-04-01 15:30:27 -0400"
    }
  }
}
},
{
"name": "Duelist Pack: Zane Truesdale",
"print_tag": "DP04-EN001",
"rarity": "Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 27.49,
      "low": 4.49,
      "average": 10.76,
      "shift": 0.00560747663551402,
      "shift_3": -0.0435555555555556,
      "shift_7": -0.0435555555555556,
      "shift_21": -0.0315031503150315,
      "shift_30": -0.0349775784753363,
      "shift_90": 0.0286806883365201,
      "shift_180": -0.126623376623377,
      "shift_365": -0.479942000966651,
      "updated_at": "2023-04-01 13:43:53 -0400"
    }
  }
}
},
{
"name": "Legendary Collection 2: The Duel Academy Years Mega Pack",
"print_tag": "LCGX-EN176",
"rarity": "Secret Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 103.22,
      "low": 4.99,
      "average": 10.73,
      "shift": 0.033718689788054,
      "shift_3": 0.0189933523266857,
      "shift_7": 0.0317307692307692,
      "shift_21": 0.00656660412757974,
      "shift_30": -0.0137867647058824,
      "shift_90": 0.0971370143149284,
      "shift_180": 0.30694275274056,
      "shift_365": -0.45560629122273,
      "updated_at": "2023-04-01 13:44:01 -0400"
    }
  }
}
},
{
"name": "Gold Series",
"print_tag": "GLD1-EN022",
"rarity": "Gold Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 26.46,
      "low": 5.39,
      "average": 7.48,
      "shift": 0.22824302134647,
      "shift_3": 0.00133868808567604,
      "shift_7": 0,
      "shift_21": 0.22824302134647,
      "shift_30": -0.148063781321185,
      "shift_90": -0.00399467376830892,
      "shift_180": -0.236734693877551,
      "shift_365": -0.410559495665879,
      "updated_at": "2023-04-01 13:43:55 -0400"
    }
  }
}
},
{
"name": "Ra Yellow Mega Pack",
"print_tag": "RYMP-EN059",
"rarity": "Secret Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 109.98,
      "low": 7.49,
      "average": 12.28,
      "shift": 0.0302013422818792,
      "shift_3": -0.00647249190938511,
      "shift_7": 0.00326797385620915,
      "shift_21": 0.0753064798598949,
      "shift_30": 0.115349682107175,
      "shift_90": 0.280500521376434,
      "shift_180": 0.486682808716707,
      "shift_365": -0.331518780620577,
      "updated_at": "2023-04-01 13:44:06 -0400"
    }
  }
}
},
{
"name": "Ghosts From the Past: The 2nd Haunting",
"print_tag": "GFP2-EN178",
"rarity": "Ghost Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 374.99,
      "low": 36.99,
      "average": 63.07,
      "shift": 0,
      "shift_3": 0.00799105002397315,
      "shift_7": -0.182925249384635,
      "shift_21": -0.0280474649406688,
      "shift_30": -0.0277478032989055,
      "shift_90": -0.0427986037334952,
      "shift_180": -0.02639703612226,
      "shift_365": 0,
      "updated_at": "2023-04-01 15:33:10 -0400"
    }
  }
}
},
{
"name": "Dark Revelation Volume 4",
"print_tag": "DR04-EN015",
"rarity": "Ultra Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 200.99,
      "low": 60,
      "average": 131.12,
      "shift": 0,
      "shift_3": -0.0000762601998017235,
      "shift_7": -0.0821783564328713,
      "shift_21": -0.0205423171733772,
      "shift_30": 0.0548672566371681,
      "shift_90": 0.0305745500275092,
      "shift_180": -0.343678045850435,
      "shift_365": -0.338479390545381,
      "updated_at": "2023-04-01 15:33:24 -0400"
    }
  }
}
},
{
"name": "OTS Tournament Pack 16",
"print_tag": "OP16-EN001",
"rarity": "Ultimate Rare",
"price_data": {
  "status": "success",
  "data": {
    "listings": [],
    "prices": {
      "high": 329.99,
      "low": 78.9,
      "average": 87.72,
      "shift": 0,
      "shift_3": 0.106179066834805,
      "shift_7": 0.00239972574562907,
      "shift_21": 0.00711825487944891,
      "shift_30": 0.118449572867525,
      "shift_90": 0.10841546626232,
      "shift_180": -0.041520979020979,
      "shift_365": -0.324243124566674,
      "updated_at": "2023-04-01 15:31:28 -0400"
    }
  }
}
},
{
"name": "Mattel Action Figure promotional cards: Series 3",
"print_tag": "MF03-EN009",
"rarity": "Normal Parallel Rare",
"price_data": {
  "status": "fail",
  "message": "Unable to find prices for this card."
}
},
{
"name": "Duel Terminal - Preview Wave 1",
"print_tag": "DTP1-EN009",
"rarity": "Duel Terminal Rare Parallel Rare",
"price_data": {
  "status": "fail",
  "message": "Unable to find prices for this card."
}
},
{
"name": "Duel Terminal 1",
"print_tag": "DT01-EN009",
"rarity": "Duel Terminal Rare Parallel Rare",
"price_data": {
  "status": "fail",
  "message": "Unable to find prices for this card."
}
}
]
    }
  },
  computed: {
    ownedPrices() {
      return this.selectedCardPrices?.find(item => item.print_tag === this.selectedCard?.print_tag);
    }
  }
}).mount('#app');