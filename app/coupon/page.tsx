"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage, type LanguageCode } from "@/contexts/LanguageContext";

/** バナーは縦の要素が多いため 4:3 で全体が切れずに見える */
const BANNER_ASPECT = "aspect-[4/3]";
const CARD_IMAGE_ASPECT = "aspect-[4/3]";

/** 参考画像の色（ご夕食クーポン!バナー） */
const HEADER_BG = "#315286";
const COUPON_BG = "#90846c";
/** 本家のクーポン文言色（若干黄色みのクリーム） */
const COUPON_TEXT_COLOR = "#EEE3C4";
const MAP_BTN_BG = "#F5A623";

const COUPON_SITE = "/coupon-site";
const bannerImage = `${COUPON_SITE}/スクリーンショット 2026-02-01 22.46.48.png`;
const backIconImage = `${COUPON_SITE}/スクリーンショット 2026-02-01 22.54.27.png`;
const shopImages = [
  `${COUPON_SITE}/スクリーンショット 2026-02-01 22.43.06.png`,
  `${COUPON_SITE}/スクリーンショット 2026-02-01 22.43.17.png`,
  `${COUPON_SITE}/スクリーンショット 2026-02-01 22.43.31.png`,
];

/** モーダル用の店舗詳細画像（MAP押下時に表示）［0=利久 1=晴れの日 2=ぼんてん漁港］ */
const shopModalImages = [
  `${COUPON_SITE}/スクリーンショット 2026-02-01 23.10.55-903b6d91-1ead-4274-9bed-07cea68945a8.png`,
  `${COUPON_SITE}/スクリーンショット 2026-02-01 23.09.25.png`,
  `${COUPON_SITE}/スクリーンショット 2026-02-01 23.12.13.png`,
];

/** モーダル用の店舗説明文（参考画像の雰囲気に合わせる） */
const shopModalDescriptions = [
  "牛たん発祥の地 仙台を代表する専門店。仙台名物牛タンをはじめ、厳選した一品料理をご堪能ください。",
  "経験豊富な漁師達が厳選した牡蠣をはじめ、旬の鮮魚をご堪能ください!",
  "漁港直送！旬の鮮魚が自慢です！新鮮な海の幸をふんだんに使った料理をご堪能ください。",
];

/** クーポンページの多言語翻訳 */
const couponTranslations: Record<
  LanguageCode,
  {
    pageTitle: string;
    backToGuide: string;
    usageMessage: string;
    usageNote: string;
    bringCoupon: string;
    shop1Offer: string;
    shop2Offer1: string;
    shop2Or: string;
    shop2Offer2: string;
    shop3Offer: string;
    map: string;
    tel: string;
    showLargerMap: string;
    close: string;
  }
> = {
  ja: {
    pageTitle: "飲食店クーポン",
    backToGuide: "← 館内案内に戻る",
    usageMessage: "配布のクーポン券を持参、またはこの画面の提示を注文時にスタッフへ渡してください。",
    usageNote: "※利用条件等は配布のクーポン券をご確認ください。",
    bringCoupon: "配布のクーポン券持参または、\nこの画面の提示で",
    shop1Offer: "店舗おまかせ一品料理無料",
    shop2Offer1: "石巻狐崎漁港直送の牡蠣1個無料",
    shop2Or: "または",
    shop2Offer2: "宮城の地酒1杯無料",
    shop3Offer: "お会計金額から10%OFF",
    map: "MAP",
    tel: "TEL",
    showLargerMap: "拡大地図を表示",
    close: "閉じる",
  },
  en: {
    pageTitle: "Restaurant Coupon",
    backToGuide: "← Back to facility guide",
    usageMessage: "Please bring the distributed coupon or show this screen to the staff when ordering.",
    usageNote: "*Please check the distributed coupon for terms and conditions.",
    bringCoupon: "With distributed coupon or by showing this screen",
    shop1Offer: "One chef's choice dish free",
    shop2Offer1: "One oyster from Ishinomaki Kitsunezaki Port free",
    shop2Or: "or",
    shop2Offer2: "One glass of Miyagi local sake free",
    shop3Offer: "10% OFF your bill",
    map: "MAP",
    tel: "TEL",
    showLargerMap: "Show larger map",
    close: "Close",
  },
  zh: {
    pageTitle: "餐饮优惠券",
    backToGuide: "← 返回馆内指南",
    usageMessage: "请携带所发优惠券或在点餐时向工作人员出示本画面。",
    usageNote: "*使用条件等请参阅所发优惠券。",
    bringCoupon: "持所发优惠券或出示本画面",
    shop1Offer: "店铺推荐一品料理免费",
    shop2Offer1: "石卷狐崎渔港直送牡蛎1个免费",
    shop2Or: "或",
    shop2Offer2: "宫城地酒1杯免费",
    shop3Offer: "结账金额10%OFF",
    map: "地图",
    tel: "电话",
    showLargerMap: "显示大地图",
    close: "关闭",
  },
  "zh-TW": {
    pageTitle: "餐飲優惠券",
    backToGuide: "← 返回館內指南",
    usageMessage: "請攜帶所發優惠券或在點餐時向工作人員出示本畫面。",
    usageNote: "*使用條件等請參閱所發優惠券。",
    bringCoupon: "持所發優惠券或出示本畫面",
    shop1Offer: "店鋪推薦一品料理免費",
    shop2Offer1: "石卷狐崎漁港直送牡蠣1個免費",
    shop2Or: "或",
    shop2Offer2: "宮城地酒1杯免費",
    shop3Offer: "結帳金額10%OFF",
    map: "地圖",
    tel: "電話",
    showLargerMap: "顯示大地圖",
    close: "關閉",
  },
  ko: {
    pageTitle: "식당 쿠폰",
    backToGuide: "← 시설 안내로 돌아가기",
    usageMessage: "배포 쿠폰을 지참하시거나 주문 시 이 화면을 스태프에게 보여 주세요.",
    usageNote: "*이용 조건 등은 배포 쿠폰을 확인해 주세요.",
    bringCoupon: "배포 쿠폰 지참 또는 이 화면 제시",
    shop1Offer: "매장 추천 일품 요리 1인분 무료",
    shop2Offer1: "이시노마키 키츠네자키 항 직송 굴 1개 무료",
    shop2Or: "또는",
    shop2Offer2: "미야기 지방주 1잔 무료",
    shop3Offer: "결제 금액에서 10% 할인",
    map: "지도",
    tel: "TEL",
    showLargerMap: "지도 크게 보기",
    close: "닫기",
  },
  fr: {
    pageTitle: "Coupon restaurant",
    backToGuide: "← Retour au guide",
    usageMessage: "Veuillez apporter le coupon distribué ou montrer cet écran au personnel lors de la commande.",
    usageNote: "*Veuillez consulter le coupon pour les conditions.",
    bringCoupon: "Avec coupon distribué ou en montrant cet écran",
    shop1Offer: "Un plat au choix du chef offert",
    shop2Offer1: "Une huître du port de Kitsunezaki offerte",
    shop2Or: "ou",
    shop2Offer2: "Un verre de saké local de Miyagi offert",
    shop3Offer: "10% de réduction sur l'addition",
    map: "CARTE",
    tel: "TEL",
    showLargerMap: "Agrandir la carte",
    close: "Fermer",
  },
  de: {
    pageTitle: "Restaurant-Gutschein",
    backToGuide: "← Zurück zur Anleitung",
    usageMessage: "Bitte bringen Sie den ausgehändigten Gutschein mit oder zeigen Sie beim Bestellen dieses Bildschirm dem Personal.",
    usageNote: "*Bitte prüfen Sie die Bedingungen auf dem Gutschein.",
    bringCoupon: "Mit ausgehändigtem Gutschein oder durch Zeigen dieses Bildschirms",
    shop1Offer: "Ein Gericht nach Wahl des Küchenchefs kostenlos",
    shop2Offer1: "Eine Auster aus dem Hafen Kitsunezaki kostenlos",
    shop2Or: "oder",
    shop2Offer2: "Ein Glas Miyagi-Sake kostenlos",
    shop3Offer: "10% Rabatt auf die Rechnung",
    map: "KARTE",
    tel: "TEL",
    showLargerMap: "Karte vergrößern",
    close: "Schließen",
  },
  es: {
    pageTitle: "Cupón de restaurante",
    backToGuide: "← Volver a la guía",
    usageMessage: "Por favor traiga el cupón distribuido o muestre esta pantalla al personal al hacer el pedido.",
    usageNote: "*Consulte el cupón para condiciones.",
    bringCoupon: "Con cupón distribuido o mostrando esta pantalla",
    shop1Offer: "Un plato de elección del chef gratis",
    shop2Offer1: "Una ostra del puerto Kitsunezaki gratis",
    shop2Or: "o",
    shop2Offer2: "Una copa de sake local de Miyagi gratis",
    shop3Offer: "10% de descuento en la cuenta",
    map: "MAPA",
    tel: "TEL",
    showLargerMap: "Ver mapa más grande",
    close: "Cerrar",
  },
  it: {
    pageTitle: "Coupon ristorante",
    backToGuide: "← Torna alla guida",
    usageMessage: "Porti il coupon distribuito o mostri questa schermata al personale al momento dell'ordine.",
    usageNote: "*Consultare il coupon per i termini.",
    bringCoupon: "Con coupon distribuito o mostrando questa schermata",
    shop1Offer: "Un piatto a scelta dello chef gratuito",
    shop2Offer1: "Un'ostrica dal porto Kitsunezaki gratuita",
    shop2Or: "o",
    shop2Offer2: "Un bicchiere di sake locale Miyagi gratuito",
    shop3Offer: "10% di sconto sul conto",
    map: "MAPA",
    tel: "TEL",
    showLargerMap: "Visualizza mappa più grande",
    close: "Chiudi",
  },
  th: {
    pageTitle: "คูปองร้านอาหาร",
    backToGuide: "← กลับไปคู่มือโรงแรม",
    usageMessage: "กรุณานำคูปองที่แจกมาหรือแสดงหน้าจอนี้ให้พนักงานเมื่อสั่งอาหาร",
    usageNote: "*กรุณาตรวจสอบเงื่อนไขในคูปอง",
    bringCoupon: "นำคูปองที่แจกมาหรือแสดงหน้าจอนี้",
    shop1Offer: "อาหารจานเชฟเลือก 1 จาน ฟรี",
    shop2Offer1: "หอยนางรมจากท่าเรือคิตสึเนซากิ 1 ตัว ฟรี",
    shop2Or: "หรือ",
    shop2Offer2: "สาเกมิยางิ 1 แก้ว ฟรี",
    shop3Offer: "ส่วนลด 10% จากยอดบิล",
    map: "แผนที่",
    tel: "TEL",
    showLargerMap: "แสดงแผนที่ขนาดใหญ่",
    close: "ปิด",
  },
  vi: {
    pageTitle: "Phiếu giảm giá nhà hàng",
    backToGuide: "← Quay lại hướng dẫn",
    usageMessage: "Vui lòng mang theo phiếu được phát hoặc hiển thị màn hình này cho nhân viên khi gọi món.",
    usageNote: "*Vui lòng xem phiếu để biết điều kiện.",
    bringCoupon: "Mang phiếu được phát hoặc hiển thị màn hình này",
    shop1Offer: "Một món do đầu bếp chọn miễn phí",
    shop2Offer1: "Một con hàu từ cảng Kitsunezaki miễn phí",
    shop2Or: "hoặc",
    shop2Offer2: "Một ly rượu sake địa phương Miyagi miễn phí",
    shop3Offer: "Giảm 10% hóa đơn",
    map: "BẢN ĐỒ",
    tel: "TEL",
    showLargerMap: "Hiện bản đồ lớn hơn",
    close: "Đóng",
  },
  id: {
    pageTitle: "Kupon restoran",
    backToGuide: "← Kembali ke panduan",
    usageMessage: "Harap bawa kupon yang dibagikan atau tunjukkan layar ini ke staf saat memesan.",
    usageNote: "*Silakan periksa kupon untuk syarat dan ketentuan.",
    bringCoupon: "Dengan kupon yang dibagikan atau menunjukkan layar ini",
    shop1Offer: "Satu hidangan pilihan chef gratis",
    shop2Offer1: "Satu tiram dari Pelabuhan Kitsunezaki gratis",
    shop2Or: "atau",
    shop2Offer2: "Satu gelas sake lokal Miyagi gratis",
    shop3Offer: "Diskon 10% dari tagihan",
    map: "PETA",
    tel: "TEL",
    showLargerMap: "Tampilkan peta lebih besar",
    close: "Tutup",
  },
  pt: {
    pageTitle: "Cupom de restaurante",
    backToGuide: "← Voltar ao guia",
    usageMessage: "Traga o cupom distribuído ou mostre esta tela à equipe ao fazer o pedido.",
    usageNote: "*Consulte o cupom para condições.",
    bringCoupon: "Com cupom distribuído ou mostrando esta tela",
    shop1Offer: "Um prato à escolha do chef grátis",
    shop2Offer1: "Uma ostra do porto Kitsunezaki grátis",
    shop2Or: "ou",
    shop2Offer2: "Uma taça de sake local de Miyagi grátis",
    shop3Offer: "10% de desconto na conta",
    map: "MAPA",
    tel: "TEL",
    showLargerMap: "Mostrar mapa maior",
    close: "Fechar",
  },
  tl: {
    pageTitle: "Coupon ng restaurant",
    backToGuide: "← Bumalik sa gabay",
    usageMessage: "Mangyaring dalhin ang distributed coupon o ipakita ang screen na ito sa staff kapag umorder.",
    usageNote: "*Mangyaring tingnan ang coupon para sa mga tuntunin.",
    bringCoupon: "Sa distributed coupon o pagpapakita ng screen na ito",
    shop1Offer: "Isang putahe ng chef's choice libre",
    shop2Offer1: "Isang oyster mula sa Kitsunezaki Port libre",
    shop2Or: "o",
    shop2Offer2: "Isang baso ng Miyagi local sake libre",
    shop3Offer: "10% OFF sa bill",
    map: "MAPA",
    tel: "TEL",
    showLargerMap: "Ipakita ang mas malaking mapa",
    close: "Isara",
  },
  ms: {
    pageTitle: "Kupon restoran",
    backToGuide: "← Kembali ke panduan",
    usageMessage: "Sila bawa kupon yang diedarkan atau tunjukkan skrin ini kepada kakitangan ketika membuat pesanan.",
    usageNote: "*Sila rujuk kupon untuk syarat.",
    bringCoupon: "Dengan kupon yang diedarkan atau menunjukkan skrin ini",
    shop1Offer: "Satu hidangan pilihan chef percuma",
    shop2Offer1: "Satu tiram dari Pelabuhan Kitsunezaki percuma",
    shop2Or: "atau",
    shop2Offer2: "Satu gelas sake tempatan Miyagi percuma",
    shop3Offer: "10% diskaun bil",
    map: "PETA",
    tel: "TEL",
    showLargerMap: "Tunjukkan peta lebih besar",
    close: "Tutup",
  },
};

const shopsBase = [
  {
    nameKey: "shop1" as const,
    imageSrc: shopImages[0],
    branches: [
      {
        name: "利久 中央通り店",
        address: "仙台市青葉区中央2-2-16",
        tel: "022-716-9233",
        lat: 38.2608,
        lng: 140.881,
        placeUrl: "https://www.google.com/maps/place/%E7%89%9B%E3%81%9F%E3%82%93%E7%82%AD%E7%84%BC+%E5%88%A9%E4%B9%85+%E4%B8%AD%E5%A4%AE%E9%80%9A%E3%82%8A%E5%BA%97/@38.2610177,140.8741262,17z/data=!4m15!1m8!3m7!1s0x5f8a28232a42fccf:0x34bbe757ba4e02bd!2z44CSOTgwLTAwMjEg5a6u5Z-O55yM5LuZ5Y-w5biC6Z2S6JGJ5Yy65Lit5aSu77yS5LiB55uu77yS4oiS77yR77yW!3b1!8m2!3d38.2610518!4d140.8763534!16s%2Fg%2F12hksj2jg!3m5!1s0x5f8a28232a432029:0xcf3eb1f583b91381!8m2!3d38.2610177!4d140.8763149!16s%2Fg%2F1tg6kccw?entry=ttu",
      },
      {
        name: "利久 本町店",
        address: "仙台市青葉区本町2-6-13",
        tel: "022-712-3567",
        lat: 38.2595,
        lng: 140.8795,
        placeUrl: "https://www.google.com/maps/place/%E7%89%9B%E3%81%9F%E3%82%93%E7%82%AD%E7%84%BC+%E5%88%A9%E4%B9%85+%E6%9C%AC%E7%94%BA%E5%BA%97/@38.263533,140.8727457,17z/data=!3m1!5s0x5f8a282491f2ffd3:0x6685ba0449279b48!4m15!1m8!3m7!1s0x5f8a2824921951dd:0x700409cb5dcededf!2z44CSOTgwLTAwMTQg5a6u5Z-O55yM5LuZ5Y-w5biC6Z2S6JGJ5Yy65pys55S677yS5LiB55uu77yW4oiS77yR77yTIOadieacrOWutuODk-ODqw!3b1!8m2!3d38.2635263!4d140.874953!16s%2Fg%2F12hrmq_bd!3m5!1s0x5f8a2824921ba961:0xdff4a21fcbc44a9b!8m2!3d38.263533!4d140.8749344!16s%2Fg%2F1tcz_bb7?entry=ttu",
      },
      {
        name: "利久 名掛丁店",
        address: "仙台市青葉区中央1-8-29 JYビル",
        tel: "022-713-9677",
        lat: 38.2612,
        lng: 140.8825,
        placeUrl: "https://www.google.com/maps/place/%E7%89%9B%E3%81%9F%E3%82%93%E7%82%AD%E7%84%BC+%E5%88%A9%E4%B9%85+%E5%90%8D%E6%8E%9B%E4%B8%81%E5%BA%97/@38.261763,140.880035,18z/data=!3m2!4b1!5s0x5f8a28225ac32e11:0xefb41ce7ca43bc5a!4m6!3m5!1s0x5f8a282251d045a1:0xd7b632116dda7828!8m2!3d38.261763!4d140.880035!16s%2Fg%2F1tg7rv7b?entry=ttu",
      },
      {
        name: "利久 西口本店",
        address: "仙台市青葉区中央1-6-1 ハーブ仙台ビル5F",
        tel: "022-266-5077",
        lat: 38.26,
        lng: 140.8815,
        placeUrl: "https://www.google.com/maps/place/%E5%88%A9%E4%B9%85+%E8%A5%BF%E5%8F%A3%E6%9C%AC%E5%BA%97/@38.2626758,140.8792835,18z/data=!3m1!5s0x5f8a2823cc6a1dc9:0x99676402b736675f!4m10!1m2!2m1!1z5LuZ5Y-w5biC6Z2S6JGJ5Yy65Lit5aSuMS02LTEg44OP44O844OW5LuZ5Y-w44OT44OrNUY!3m6!1s0x5f8a2823cc701739:0x7fc151ed26a5fea1!8m2!3d38.2626758!4d140.8803778!15sCjXku5nlj7DluILpnZLokYnljLrkuK3lpK4xLTYtMSDjg4_jg7zjg5bku5nlj7Djg5Pjg6s1Rlo_Ij3ku5nlj7Ag5biCIOmdkuiRiSDljLog5Lit5aSuIDEgNiAxIOODj-ODvOODliDku5nlj7Ag44OT44OrIDVmkgERdG9uZ3VlX3Jlc3RhdXJhbnSaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnBGTTFRd09XOU5hazVVVDFoVmQxWkVWazFOUmpnelZHMVpNbUZyUlJBQuABAPoBBQi0ARAd!16s%2Fg%2F1th81rys?entry=ttu",
      },
    ],
    hours: "営)共通11:30~14:30、17:00~23:00",
    holiday: "休)年中無休",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=仙台市青葉区中央2-2-16",
  },
  {
    nameKey: "shop2" as const,
    imageSrc: shopImages[1],
    branches: [
      {
        name: "晴れの日 名掛丁店",
        address: "仙台市青葉区中央1-8-25 マジェスティックビル3F",
        tel: "022-797-6971",
        lat: 38.261,
        lng: 140.8822,
        hours: "営)月~木曜\n17:00~23:00(L.O.22:00)\n金・土曜・祝前日\n16:00~24:00(L.O.23:00)\n日曜・祝日\n16:00~23:00(L.O.22:00)",
        holiday: "休)不定休",
        placeUrl: "https://www.google.com/maps/place/%E7%9F%B3%E5%B7%BB%E7%8B%90%E5%B4%8E%E6%BC%81%E6%B8%AF+%E6%99%B4%E3%82%8C%E3%81%AE%E6%97%A5+%E5%90%8D%E6%8E%9B%E4%B8%81%E5%BA%97/@38.2618179,140.8775567,17z/data=!3m1!5s0x5f8a28225a688d6f:0xb60995574b0aca6b!4m10!1m2!2m1!1z5LuZ5Y-w5biC6Z2S6JGJ5Yy65Lit5aSuMS04LTI1IOODnuOCuOOCp-OCueODhuOCo-ODg-OCr-ODk-ODqzNG!3m6!1s0x5f8a282250c4d71f:0xc3d0757489e57438!8m2!3d38.2618179!4d140.8797454!15sCj_ku5nlj7DluILpnZLokYnljLrkuK3lpK4xLTgtMjUg44Oe44K444Kn44K544OG44Kj44OD44Kv44OT44OrM0ZaSCJG5LuZ5Y-wIOW4giDpnZLokYkg5Yy6IOS4reWkriAxIDggMjUg44Oe44K444Kn44K544OG44Kj44OD44KvIOODk-ODqyAzZpIBG2phcGFuZXNlX2l6YWtheWFfcmVzdGF1cmFudJoBRENpOURRVWxSUVVOdlpFTm9kSGxqUmpsdlQyeHdjbE5GWkZwWk1XOTNaVU14ZW1GRmRGTlNhMFpOWVVWd2RsTnJSUkFC4AEA-gEFCN0CECI!16s%2Fg%2F11b6vdczm2?entry=ttu",
      },
      {
        name: "晴れの日 稲荷小路店",
        address: "仙台市青葉区一番町4-3-5 都ビル2F",
        tel: "022-217-9660",
        lat: 38.2598,
        lng: 140.8785,
        hours: "営)16:30~23:00(L.O.22:00)",
        holiday: "休)不定休",
        placeUrl: "https://www.google.com/maps/place/%E7%84%BC%E9%B3%A5%E3%81%A8%E5%AE%AE%E5%9F%8E%E3%81%AE%E6%97%A8%E3%81%84%E3%82%82%E3%81%AE+%E6%99%B4%E3%82%8C%E3%81%AE%E6%97%A5/@38.2624707,140.8686461,17z/data=!3m1!5s0x5f8a283b16ad851d:0x431c43f81ddc40ff!4m10!1m2!2m1!1z5LuZ5Y-w5biC6Z2S6JGJ5Yy65LiA55Wq55S6NC0zLTUg6YO944OT44OrMkY!3m6!1s0x5f8a283b16c58571:0xb568c7c07b3e00af!8m2!3d38.2624707!4d140.8708348!15sCizku5nlj7DluILpnZLokYnljLrkuIDnlarnlLo0LTMtNSDpg73jg5Pjg6syRlo3IjXku5nlj7Ag5biCIOmdkuiRiSDljLog5LiAIOeVqiDnlLogNCAzIDUg6YO9IOODk-ODqyAyZpIBE3lha2l0b3JpX3Jlc3RhdXJhbnSaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnR3WVdWSVJuVk9SVXAyWlZNeGFXUnNTbEZTTWs0MVkwVm9VVlZJWXhBQuABAPoBBQicARAJ!16s%2Fg%2F11xfz77f4?entry=ttu",
      },
    ],
    hours: undefined,
    holiday: undefined,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=仙台市青葉区中央1-8-25",
  },
  {
    nameKey: "shop3" as const,
    imageSrc: shopImages[2],
    branches: [
      { name: null, address: "仙台市青葉区中央2-11-11", tel: "022-265-8118", lat: 38.2605, lng: 140.8805 },
    ],
    hours: "営)11:30~23:00",
    holiday: "休)日曜日",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=仙台市青葉区中央2-11-11",
  },
];

const shopNames: Record<string, string> = {
  shop1: "利久",
  shop2: "晴れの日",
  shop3: "ぼんてん漁港 中央二丁目店",
};

const mainLanguages = [
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "zh-TW", flag: "🇹🇼", label: "繁體中文" },
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
];

const otherLanguages = [
  { code: "th", flag: "🇹🇭", label: "ไทย" },
  { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { code: "tl", flag: "🇵🇭", label: "Tagalog" },
  { code: "id", flag: "🇮🇩", label: "Bahasa Indonesia" },
  { code: "ms", flag: "🇲🇾", label: "Bahasa Melayu" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "pt", flag: "🇵🇹", label: "Português" },
];

export default function CouponPage() {
  const { language: selectedLanguage, setLanguage: setSelectedLanguage } = useLanguage();
  const [showOtherLanguages, setShowOtherLanguages] = useState(false);
  const [openModalShopIndex, setOpenModalShopIndex] = useState<number | null>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const t = couponTranslations[selectedLanguage] ?? couponTranslations.ja;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showOtherLanguages &&
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowOtherLanguages(false);
      }
    };
    if (showOtherLanguages) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOtherLanguages]);

  return (
    <div className="min-h-screen bg-[#f9f2d4]">
      {/* ヘッダー（タイトル＋言語翻訳機能・館内案内に戻るはバナー左上に配置） */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <h1 className="min-w-0 shrink text-base font-bold text-gray-900 sm:text-lg">
            {t.pageTitle}
          </h1>
          <div className="flex-1 min-w-0" aria-hidden />
          {/* 言語選択（ホームと同じ） */}
          <div ref={languageDropdownRef} className="flex shrink-0 items-center space-x-0.5 sm:space-x-1 relative flex-nowrap">
            <button
              onClick={() => setShowOtherLanguages(!showOtherLanguages)}
              className={`flex flex-col items-center rounded p-0.5 sm:p-1 transition-colors ${
                showOtherLanguages ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              title="Other Languages"
            >
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center text-base sm:text-lg leading-none">🌐</span>
              <span className="mt-0.5 text-[8px] sm:text-[10px] leading-tight text-gray-700">Another</span>
            </button>
            {showOtherLanguages && (
              <div className="absolute top-full right-0 z-50 mt-2 max-h-[60vh] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg sm:max-h-[300px] sm:w-auto sm:max-w-none">
                <div className="grid grid-cols-2 gap-2">
                  {otherLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code as LanguageCode);
                        setShowOtherLanguages(false);
                      }}
                      className={`flex flex-col items-center rounded p-1.5 sm:p-2 transition-colors ${
                        selectedLanguage === lang.code ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      title={lang.label}
                    >
                      <span className="mb-1 text-base sm:text-lg leading-none">{lang.flag}</span>
                      <span className="text-center text-[10px] sm:text-xs leading-tight text-gray-700">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {mainLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLanguage(lang.code as LanguageCode);
                  setShowOtherLanguages(false);
                }}
                className={`flex flex-col items-center rounded p-0.5 sm:p-1 transition-colors ${
                  selectedLanguage === lang.code ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                title={lang.label}
              >
                <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center text-base sm:text-lg leading-none">{lang.flag}</span>
                <span className="mt-0.5 text-[8px] sm:text-[10px] leading-tight text-gray-700">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* メインバナー（ご夕食クーポン!）・スマホでは館内案内に戻るを上に分離、PCでは左上にオーバーレイ */}
        <section className="mb-6 -mx-4 sm:-mx-6 relative">
          {/* スマホ版：館内案内に戻るをバナー上に表示（重なり防止） */}
          <Link
            href="/"
            className="sm:hidden mb-3 flex items-center gap-2 px-1 transition-opacity hover:opacity-90 hover:underline"
            style={{ color: "#304E84" }}
          >
            <Image
              src={encodeURI(backIconImage)}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 object-contain"
              unoptimized
            />
            <span className="text-sm font-semibold leading-tight">{t.backToGuide}</span>
          </Link>
          <div className={`relative w-full overflow-hidden ${BANNER_ASPECT} max-h-[380px] bg-[#f9f2d4] sm:max-h-[420px]`}>
            <Image
              src={encodeURI(bannerImage)}
              alt="ご夕食クーポン!"
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
            {/* PC版：バナー左上に鳥アイコン＋館内案内に戻るをオーバーレイ */}
            <Link
              href="/"
              className="hidden sm:flex absolute left-4 top-4 z-10 flex-col items-center gap-2 transition-opacity hover:opacity-90 hover:underline"
              style={{ color: "#304E84" }}
            >
              <Image
                src={encodeURI(backIconImage)}
                alt=""
                width={112}
                height={112}
                className="h-24 w-24 shrink-0 object-contain"
                unoptimized
              />
              <span className="text-center text-sm font-semibold leading-tight">{t.backToGuide}</span>
            </Link>
          </div>
        </section>

        {/* 利用案内（参考画像の説明文） */}
        <section className="mb-8">
          <p className="text-center text-[15px] font-medium leading-relaxed sm:text-base" style={{ color: "#c26c36" }}>
            {t.usageMessage}
          </p>
          <p className="mt-1 text-center text-xs text-gray-600">
            {t.usageNote}
          </p>
        </section>

        {/* 3店舗クーポンカード（MAPボタン下端揃え） */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {shopsBase.map((shop, i) => {
            const name = shopNames[shop.nameKey] ?? "";
            const couponContent =
              i === 0 ? (
                <>
                  {t.bringCoupon.split("\n").map((line, j) => (
                    <span key={j}>
                      {j > 0 && <br />}
                      {line}
                    </span>
                  ))}
                  <br />
                  <span className="text-white">{t.shop1Offer}</span>
                </>
              ) : i === 1 ? (
                <>
                  {t.bringCoupon.split("\n").map((line, j) => (
                    <span key={j}>
                      {j > 0 && <br />}
                      {line}
                    </span>
                  ))}
                  <br />
                  <span className="text-white">
                    {t.shop2Offer1}
                    <br />
                    {t.shop2Or}
                    <br />
                    {t.shop2Offer2}
                  </span>
                </>
              ) : (
                <>
                  {t.bringCoupon.split("\n").map((line, j) => (
                    <span key={j}>
                      {j > 0 && <br />}
                      {line}
                    </span>
                  ))}
                  <br />
                  <span className="text-white">{t.shop3Offer}</span>
                </>
              );
            return (
              <article
                key={i}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                {/* 店舗名ヘッダー（紺色） */}
                <div
                  className="flex items-center justify-center px-4 py-3 text-center text-white font-semibold"
                  style={{ backgroundColor: HEADER_BG }}
                >
                  <span className="text-sm sm:text-base">{name}</span>
                </div>

                {/* 料理画像（coupon-site フォルダの写真） */}
                <div className={`relative w-full ${CARD_IMAGE_ASPECT} bg-gray-100`}>
                  <Image
                    src={encodeURI(shop.imageSrc)}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>

                {/* クーポン内容（ベージュ・スマホは文字大きく見やすく） */}
                <div
                  className="flex h-34 flex-col items-center justify-center px-4 py-3 text-center text-base font-bold leading-relaxed sm:h-36 sm:text-sm"
                  style={{ backgroundColor: COUPON_BG, color: COUPON_TEXT_COLOR }}
                >
                  {couponContent}
                </div>

                {/* 店舗情報（白背景・MAPを下端で横揃え・MAP下に余白） */}
                <div className="flex min-h-0 flex-1 flex-col bg-white px-4 pt-3 pb-3 text-sm text-gray-900">
                  <div className="min-h-0 flex-1">
                    {shop.branches.map((b, j) => (
                      <div key={j} className={j > 0 ? "mt-3 pt-3 border-t border-gray-200" : ""}>
                        {"name" in b && b.name != null && (
                          <p className="font-semibold text-gray-900">{b.name}</p>
                        )}
                        <p className="mt-0.5">{b.address}</p>
                        <p className="mt-0.5">{t.tel} {b.tel}</p>
                        {"hours" in b && b.hours != null && (
                          <p className="mt-1 text-xs whitespace-pre-line">{b.hours}</p>
                        )}
                        {"holiday" in b && b.holiday != null && (
                          <p className="mt-0.5 text-xs whitespace-pre-line">{b.holiday}</p>
                        )}
                      </div>
                    ))}
                    {shop.hours != null && (
                      <p className="mt-2 text-xs whitespace-pre-line">{shop.hours}</p>
                    )}
                    {shop.holiday != null && (
                      <p className="mt-0.5 text-xs whitespace-pre-line">{shop.holiday}</p>
                    )}
                  </div>

                  {/* MAPボタン（モーダルを開く・外部へ飛ばない） */}
                  <button
                    type="button"
                    onClick={() => setOpenModalShopIndex(i)}
                    className="mt-4 flex w-full shrink-0 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: MAP_BTN_BG }}
                  >
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {t.map}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

      </main>

      {/* 店舗詳細モーダル（MAP押下時・外部へ飛ばず画面内で表示） */}
      {openModalShopIndex !== null && (() => {
        const shop = shopsBase[openModalShopIndex];
        const modalName = shopNames[shopsBase[openModalShopIndex].nameKey] ?? "";
        const modalImage = shopModalImages[openModalShopIndex];
        const description = shopModalDescriptions[openModalShopIndex];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setOpenModalShopIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="flex max-h-[90vh] w-full max-w-xl min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ヘッダー（店舗名＋閉じる） */}
              <div
                className="flex shrink-0 items-center justify-between px-4 py-3 text-white"
                style={{ backgroundColor: HEADER_BG }}
              >
                <h2 id="modal-title" className="text-lg font-semibold">
                  {modalName}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpenModalShopIndex(null)}
                  className="rounded p-1 text-white/90 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label={t.close}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
                {/* モーダル用画像（2枚並びなど横長画像も全体が見えるよう object-contain） */}
                <div className="relative w-full min-h-[200px] overflow-hidden bg-gray-100" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={encodeURI(modalImage)}
                    alt={modalName}
                    fill
                    className="object-contain"
                    sizes="(max-width: 576px) 100vw, 576px"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 px-4 py-4">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {description}
                  </p>
                  {/* 全店舗分を表示（利久は4店舗・晴れの日2店舗・ぼんてん1店舗） */}
                  {shop.branches.map((branch, branchIndex) => {
                    const branchAddress = branch.address;
                    const branchMapUrl =
                      "placeUrl" in branch && typeof branch.placeUrl === "string"
                        ? branch.placeUrl
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branchAddress)}`;
                    const branchMapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(branchAddress)}&z=17&output=embed`;
                    const branchLabel = "name" in branch && branch.name != null ? branch.name : `${modalName} ${branchIndex + 1}`;
                    return (
                      <div
                        key={branchIndex}
                        className={`min-w-0 ${branchIndex > 0 ? "mt-6 border-t border-gray-200 pt-4" : "mt-4 border-t border-gray-200 pt-4"}`}
                      >
                        <div className="text-sm text-gray-900">
                          {"name" in branch && branch.name != null && (
                            <p className="font-semibold">{branch.name}</p>
                          )}
                          <p className="mt-1">{branch.address}</p>
                          <p className="mt-1">{t.tel} {branch.tel}</p>
                          {"hours" in branch && branch.hours != null && (
                            <p className="mt-2 text-xs text-gray-600 whitespace-pre-line">{branch.hours}</p>
                          )}
                          {"holiday" in branch && branch.holiday != null && (
                            <p className="mt-0.5 text-xs text-gray-600 whitespace-pre-line">{branch.holiday}</p>
                          )}
                        </div>
                        {/* 各店舗のミニマップ（見切れ防止のためmin-w-0と十分な高さを確保） */}
                        <div className="mt-3 w-full min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          <iframe
                            title={branchLabel}
                            src={branchMapEmbedUrl}
                            width="100%"
                            height="240"
                            style={{ border: 0, display: "block", minHeight: 240 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="block w-full"
                          />
                        </div>
                        {/* 各店舗の拡大地図を表示 */}
                        <a
                          href={branchMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: MAP_BTN_BG }}
                        >
                          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          {t.showLargerMap}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
