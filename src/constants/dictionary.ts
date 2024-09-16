import { Dictionaries } from "../types/Dictionaries";
import { ProductType } from "../types/ProductType";

export const dictionary: Dictionaries = {
  en: {
    addCard: "Add Card",
    buy: "Buy",
    cantBuy: (product: ProductType, credits: number) =>
      `You need $${product.price - credits} more to buy ${product.name}`,
    chooseCard: "Choose a card",
    close: "Close",
    controller: "Controller",
    controllerPack: "Controller Pack",
    credits: "Credits",
    duelist: "Duelist",
    duelistPack: "Duelist Pack",
    game: "Game",
    home: "Home",
    initiator: "Initiator",
    initiatorPack: "Initiator Pack",
    kingdomCredits: "Kingdom Credits",
    mixedPack: "Mixed Pack",
    newPack: "New Pack",
    noCards: "No cards to change...",
    play: "Play",
    sentinel: "Sentinel",
    sentinelPack: "Sentinel Pack",
    settings: "Settings",
    shop: "Shop",
    start: "Start",
    team: "Team",
    wannaBuy: (product: ProductType) => `Do you want to buy ${product.name}?`,
  },

  es: {
    addCard: "Añadir Carta",
    buy: "Comprar",
    cantBuy: (product: ProductType, credits: number) =>
      `Necesitas $${product.price - credits} más para comprar ${product.name}`,
    chooseCard: "Elige una carta",
    close: "Cerrar",
    controller: "Controlador",
    controllerPack: "Pack Controlador",
    credits: "Créditos",
    duelist: "Duelista",
    duelistPack: "Pack Duelista",
    game: "Partida",
    home: "Inicio",
    initiator: "Iniciador",
    initiatorPack: "Pack Iniciador",
    kingdomCredits: "Créditos Kingdom",
    mixedPack: "Pack Mixto",
    newPack: "Pack Nuevo",
    noCards: "No tienes cartas para cambiar...",
    play: "Jugar",
    sentinel: "Centinela",
    sentinelPack: "Pack Centinela",
    settings: "Opciones",
    shop: "Tienda",
    start: "Empezar",
    team: "Equipo",
    wannaBuy: (product: ProductType) => `¿Quieres comprar ${product.name}?`,
  },
};
