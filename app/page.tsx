'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage, type LanguageCode } from '@/contexts/LanguageContext';

const translations = {
  ja: {
    hotelName: '天然温泉 青葉の湯',
    hotelTitle: 'ドーミーイン仙台ANNEX',
    heroTitle: 'ホテル館内のご案内',
    welcomeMessage: '本日は「天然温泉 青葉の湯ドーミーイン仙台ANNEX」をご利用いただき誠にありがとうございます。',
    welcomeMessage2: 'ご不明な点がございましたらフロントスタッフまでお気軽にお尋ねください。',
    restaurantCoupon: '飲食店クーポン',
    checkInOut: '入退館時間',
    bath: '大浴場',
    breakfast: '朝食・夜鳴きそば',
    dinner: '夕食・お得なクーポン',
    dinnerCatchphrase: '今夜のご夕食にどうぞ',
    dinnerCouponLabel: 'お得な飲食店クーポン',
    service: 'サービスコーナー',
    wifi: 'Wi-Fi',
    lighting: '室内照明',
    longstay: '連泊のお客様へ',
    lost: 'お忘れ物について',
    quickCheckin: '快速チェックイン',
    dinnerTab: '夕食・お得なクーポン',
    serviceTab: 'サービスコーナー',
    close: '閉じる',
    copyPassword: 'コピー',
    copiedToClipboard: 'コピーしました',
    checkIn: 'チェックイン',
    checkOut: 'チェックアウト',
    planNote: '※プランによって時間が異なる場合がございます。',
    bathTitle: '大浴場',
    bathDescription: '男女別大浴場「青葉の湯」9F',
    operatingHours: '営業時間:',
    bathHours: '15:00~翌10:00',
    saunaNote: '(サウナのみ1:00~5:00停止)',
    notice: 'ご注意',
    bathNotice1: '※タオル、アメニティは各自お部屋からお持ちください。',
    bathNotice2: '※女性大浴場へ入場する際は暗証番号が必要です。暗証番号はフロントにてお渡しします。',
    freeService: '無料サービス',
    bathServiceDesc: '乳酸菌飲料とアイスキャンディーを無料で提供しております。',
    breakfastTitle: 'ご朝食と夜鳴きそば (1F レストラン)',
    breakfastPrice: '■ご朝食 / 2,300円',
    breakfastHours: '6:15~9:30 (最終入店9:00)',
    breakfastNote1: '※満席の場合はお待ちいただくことがございます。',
    breakfastNote2: '※混雑状況により営業時間を変更させていただく場合がございます。',
    sobaTitle: '■夜鳴きそば (ハーフサイズ) / 無料',
    sobaHours: '21:30~23:00',
    sobaNote: '※営業時間は変更になる場合がございます。',
    serviceTitle: 'サービスコーナー',
    vendingMachine: '自動販売機',
    alcoholNote: '(アルコール類は5・9F)',
    microwave: '電子レンジ',
    iceMaker: '製氷機',
    smoking: '喫煙コーナー',
    trouserPress: 'ズボンプレッサー',
    trouserPressLocation: '各階エレベーター前',
    laundry: 'ランドリーコーナー',
    laundryNote: '※洗剤、洗濯機/無料 乾燥機/有料(30分100円)',
    wifiTitle: 'Wi-Fi',
    password: 'Password :',
    lostTitle: 'お忘れ物',
    lostText1: '忘れ物等については、原則ホテルからの連絡は致しません。',
    lostText2: 'またご連絡が無い場合は、遺失物法に基づき3ヶ月経過後処分させていただきます。',
    lostText3: 'ただし、飲食物につきましては即日処分させていただきます。',
    lightingTitle: '室内照明',
    lightingDesc: '入室後、入口脇の電源ソケットにお部屋のキーホルダーを差し込む事で室内照明は点灯致します。',
    lightingNote: 'カードキーを電源ソケットに差し込みます。',
    longstayTitle: '連泊のお客様へ',
    sheetExchange: 'シーツ・布団カバー・枕カバーの交換をご希望のお客様は「WECOカード」をベッド上にご提示をお願い致します。カードのご提示が無い場合は交換を行いませんので、予めご了承下さいませ。(タオル類や部屋着の交換は行います。)',
    noCleaning: '清掃不要のお客様は、入り口ドアの内側にある緑色の「WECO」カードを廊下側にご提示くださいませ。その場合清掃を行わず入室も致しません。',
    officialHP: '公式HPはこちら',
    preparing: '詳細情報は準備中です。',
  },
  en: {
    hotelName: 'Natural Hot Spring Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Hotel Guide',
    welcomeMessage: 'Thank you very much for staying at \"Natural Hot Spring Aoba no Yu Dormy Inn Sendai ANNEX\" today.',
    welcomeMessage2: 'If you have any questions, please feel free to ask our front desk staff.',
    restaurantCoupon: 'Restaurant Coupon',
    checkInOut: 'Check-in/Check-out',
    bath: 'Public Bath',
    breakfast: 'Breakfast & Late Night Soba',
    dinner: 'Dinner & Coupons',
    dinnerCatchphrase: 'How about dinner tonight?',
    dinnerCouponLabel: 'Restaurant Coupons',
    service: 'Service Corner',
    wifi: 'Wi-Fi',
    lighting: 'Room Lighting',
    longstay: 'For Long-term Guests',
    lost: 'Lost & Found',
    quickCheckin: 'Quick Check-in',
    dinnerTab: 'Dinner & Coupons',
    serviceTab: 'Service Corner',
    close: 'Close',
    copyPassword: 'Copy',
    copiedToClipboard: 'Copied!',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    planNote: '*Times may vary depending on the plan.',
    bathTitle: 'Public Bath',
    bathDescription: 'Separate men\'s and women\'s public bath \"Aoba no Yu\" 9F',
    operatingHours: 'Operating Hours:',
    bathHours: '15:00~Next day 10:00',
    saunaNote: '(Sauna only: 1:00~5:00 closed)',
    notice: 'Notice',
    bathNotice1: '*Please bring your own towels and amenities from your room.',
    bathNotice2: '*A passcode is required to enter the women\'s public bath. The passcode will be provided at the front desk.',
    freeService: 'Free Service',
    bathServiceDesc: 'We provide free lactic acid drinks and ice candy.',
    breakfastTitle: 'Breakfast & Late Night Soba (1F Restaurant)',
    breakfastPrice: '■Breakfast / ¥2,300',
    breakfastHours: '6:15~9:30 (Last entry 9:00)',
    breakfastNote1: '*You may be asked to wait if the restaurant is full.',
    breakfastNote2: '*Operating hours may change depending on congestion.',
    sobaTitle: '■Late Night Soba (Half Size) / Free',
    sobaHours: '21:30~23:00',
    sobaNote: '*Operating hours may change.',
    serviceTitle: 'Service Corner',
    vendingMachine: 'Vending Machine',
    alcoholNote: '(Alcoholic beverages: 5F, 9F)',
    microwave: 'Microwave',
    iceMaker: 'Ice Maker',
    smoking: 'Smoking Area',
    trouserPress: 'Trouser Press',
    trouserPressLocation: 'In front of elevator on each floor',
    laundry: 'Laundry Corner',
    laundryNote: '*Detergent, washing machine/free, dryer/paid (¥100 per 30 minutes)',
    wifiTitle: 'Wi-Fi',
    password: 'Password:',
    lostTitle: 'Lost & Found',
    lostText1: 'As a rule, the hotel will not contact you regarding lost items.',
    lostText2: 'If there is no contact, items will be disposed of after 3 months in accordance with the Lost Property Act.',
    lostText3: 'However, food and beverages will be disposed of on the same day.',
    lightingTitle: 'Room Lighting',
    lightingDesc: 'After entering the room, insert your room key holder into the power socket next to the entrance to turn on the room lighting.',
    lightingNote: 'Insert the card key into the power socket.',
    longstayTitle: 'For Long-term Guests',
    sheetExchange: 'Guests who wish to exchange sheets, futon covers, and pillowcases, please display the \"WECO Card\" on the bed. We will not exchange them if the card is not displayed. (We will exchange towels and room wear.)',
    noCleaning: 'Guests who do not need cleaning, please display the green \"WECO\" card on the corridor side, which is located on the inside of the entrance door. In that case, we will not clean or enter the room.',
    officialHP: 'Official Website',
    preparing: 'Detailed information is being prepared.',
  },
  zh: {
    hotelName: '天然温泉 青葉之汤',
    hotelTitle: '多米酒店仙台ANNEX',
    heroTitle: '酒店内指南',
    welcomeMessage: '非常感谢您今天入住「天然温泉 青葉之汤多米酒店仙台站前」。',
    welcomeMessage2: '如有任何疑问，请随时咨询前台工作人员。',
    restaurantCoupon: '餐厅优惠券',
    checkInOut: '入住/退房时间',
    bath: '大浴场',
    breakfast: '早餐・夜鸣荞麦面',
    dinner: '晚餐・优惠券',
    dinnerCatchphrase: '今晚的晚餐',
    dinnerCouponLabel: '餐厅优惠券',
    service: '服务角',
    wifi: 'Wi-Fi',
    lighting: '室内照明',
    longstay: '长期住宿客人',
    lost: '失物招领',
    quickCheckin: '快速入住',
    dinnerTab: '晚餐・优惠券',
    serviceTab: '服务角',
    close: '关闭',
    copyPassword: '复制',
    copiedToClipboard: '已复制!',
    checkIn: '入住',
    checkOut: '退房',
    planNote: '※根据套餐不同，时间可能有所不同。',
    bathTitle: '大浴场',
    bathDescription: '男女分开大浴场「青葉之汤」9F',
    operatingHours: '营业时间:',
    bathHours: '15:00~次日10:00',
    saunaNote: '(仅桑拿：1:00~5:00停止)',
    notice: '注意事项',
    bathNotice1: '※请从房间自带毛巾和洗浴用品。',
    bathNotice2: '※进入女性大浴场时需要密码。密码将在前台提供。',
    freeService: '免费服务',
    bathServiceDesc: '我们免费提供乳酸菌饮料和冰棒。',
    breakfastTitle: '早餐与夜鸣荞麦面 (1F 餐厅)',
    breakfastPrice: '■早餐 / 2,300日元',
    breakfastHours: '6:15~9:30 (最后入场9:00)',
    breakfastNote1: '※如果满座，可能需要等待。',
    breakfastNote2: '※根据拥挤情况，营业时间可能会有所变更。',
    sobaTitle: '■夜鸣荞麦面 (半份) / 免费',
    sobaHours: '21:30~23:00',
    sobaNote: '※营业时间可能会有所变更。',
    serviceTitle: '服务角',
    vendingMachine: '自动售货机',
    alcoholNote: '(酒精类：5F・9F)',
    microwave: '微波炉',
    iceMaker: '制冰机',
    smoking: '吸烟区',
    trouserPress: '裤子压烫机',
    trouserPressLocation: '各层电梯前',
    laundry: '洗衣角',
    laundryNote: '※洗涤剂、洗衣机/免费 烘干机/收费(30分钟100日元)',
    wifiTitle: 'Wi-Fi',
    password: '密码:',
    lostTitle: '失物招领',
    lostText1: '关于失物，原则上酒店不会主动联系。',
    lostText2: '如果没有联系，将根据遗失物法在3个月后处理。',
    lostText3: '但是，食物和饮料将在当天处理。',
    lightingTitle: '室内照明',
    lightingDesc: '进入房间后，将房间钥匙扣插入入口旁边的电源插座，即可点亮室内照明。',
    lightingNote: '请将房卡插入电源插座。',
    longstayTitle: '长期住宿客人',
    sheetExchange: '希望更换床单、被套和枕套的客人，请在床上展示「WECO卡」。如果没有展示卡片，将不会进行更换。（我们会更换毛巾和房间服装。）',
    noCleaning: '不需要清洁的客人，请在走廊侧展示位于入口门内侧的绿色「WECO」卡。在这种情况下，我们将不会进行清洁或进入房间。',
    officialHP: '官方网站',
    preparing: '详细信息正在准备中。',
  },
  ko: {
    hotelName: '천연온천 아오바노유',
    hotelTitle: '도미인 센다이 ANNEX',
    heroTitle: '호텔 내 안내',
    welcomeMessage: '오늘 「천연온천 아오바노유 도미인 센다이역앞」을 이용해 주셔서 진심으로 감사드립니다.',
    welcomeMessage2: '궁금한 점이 있으시면 프론트 직원에게 언제든지 문의해 주세요.',
    restaurantCoupon: '식당 쿠폰',
    checkInOut: '체크인/체크아웃 시간',
    bath: '대욕장',
    breakfast: '조식・야나키소바',
    dinner: '석식・할인 쿠폰',
    dinnerCatchphrase: '오늘 저녁은 어떠세요?',
    dinnerCouponLabel: '식당 할인 쿠폰',
    service: '서비스 코너',
    wifi: 'Wi-Fi',
    lighting: '실내 조명',
    longstay: '장기 투숙 고객',
    lost: '분실물 안내',
    quickCheckin: '퀵 체크인',
    dinnerTab: '석식・할인 쿠폰',
    serviceTab: '서비스 코너',
    close: '닫기',
    copyPassword: '복사',
    copiedToClipboard: '복사됨!',
    checkIn: '체크인',
    checkOut: '체크아웃',
    planNote: '※플랜에 따라 시간이 다를 수 있습니다.',
    bathTitle: '대욕장',
    bathDescription: '남녀 분리 대욕장 「아오바노유」 9F',
    operatingHours: '영업 시간:',
    bathHours: '15:00~익일 10:00',
    saunaNote: '(사우나만 1:00~5:00 중지)',
    notice: '주의사항',
    bathNotice1: '※수건, 어메니티는 각자 방에서 가져오시기 바랍니다.',
    bathNotice2: '※여성 대욕장 입장 시 비밀번호가 필요합니다. 비밀번호는 프론트에서 제공합니다.',
    freeService: '무료 서비스',
    bathServiceDesc: '유산균 음료와 아이스 캔디를 무료로 제공하고 있습니다.',
    breakfastTitle: '조식과 야나키소바 (1F 레스토랑)',
    breakfastPrice: '■조식 / 2,300엔',
    breakfastHours: '6:15~9:30 (최종 입장 9:00)',
    breakfastNote1: '※만석인 경우 대기하실 수 있습니다.',
    breakfastNote2: '※혼잡 상황에 따라 영업 시간이 변경될 수 있습니다.',
    sobaTitle: '■야나키소바 (하프 사이즈) / 무료',
    sobaHours: '21:30~23:00',
    sobaNote: '※영업 시간은 변경될 수 있습니다.',
    serviceTitle: '서비스 코너',
    vendingMachine: '자동 판매기',
    alcoholNote: '(주류: 5F・9F)',
    microwave: '전자레인지',
    iceMaker: '제빙기',
    smoking: '흡연 코너',
    trouserPress: '바지 프레스',
    trouserPressLocation: '각 층 엘리베이터 앞',
    laundry: '세탁 코너',
    laundryNote: '※세제, 세탁기/무료 건조기/유료(30분 100엔)',
    wifiTitle: 'Wi-Fi',
    password: '비밀번호:',
    lostTitle: '분실물',
    lostText1: '분실물에 대해서는 원칙적으로 호텔에서 연락하지 않습니다.',
    lostText2: '또한 연락이 없는 경우, 유실물법에 따라 3개월 경과 후 처분합니다.',
    lostText3: '다만, 음식물에 대해서는 당일 처분합니다.',
    lightingTitle: '실내 조명',
    lightingDesc: '입실 후, 입구 옆 전원 소켓에 방 키홀더를 꽂으면 실내 조명이 켜집니다.',
    lightingNote: '카드키를 전원 소켓에 꽂습니다.',
    longstayTitle: '장기 투숙 고객',
    sheetExchange: '시트・이불 커버・베개 커버 교체를 원하시는 고객은 「WECO 카드」를 침대 위에 제시해 주시기 바랍니다. 카드 제시가 없으면 교체하지 않으니 미리 양해 부탁드립니다. (수건류나 실내복 교체는 합니다.)',
    noCleaning: '청소 불필요한 고객은 입구 문 안쪽에 있는 녹색 「WECO」 카드를 복도 쪽에 제시해 주시기 바랍니다. 그 경우 청소를 하지 않고 입실도 하지 않습니다.',
    officialHP: '공식 홈페이지',
    preparing: '상세 정보를 준비 중입니다.',
  },
  fr: {
    hotelName: 'Source thermale naturelle Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Guide de l\'hôtel',
    welcomeMessage: 'Merci beaucoup d\'avoir séjourné aujourd\'hui au \"Source thermale naturelle Aoba no Yu Dormy Inn Sendai ANNEX\".',
    welcomeMessage2: 'Si vous avez des questions, n\'hésitez pas à contacter notre réception.',
    restaurantCoupon: 'Coupon Restaurant',
    checkInOut: 'Enregistrement/Départ',
    bath: 'Bain public',
    breakfast: 'Petit-déjeuner & Soba de nuit',
    dinner: 'Dîner & Coupons',
    dinnerCatchphrase: 'Et pour le dîner ce soir ?',
    dinnerCouponLabel: 'Coupons restaurant',
    service: 'Coin Service',
    wifi: 'Wi-Fi',
    lighting: 'Éclairage intérieur',
    longstay: 'Pour les clients longue durée',
    lost: 'Objets trouvés',
    quickCheckin: 'Check-in rapide',
    dinnerTab: 'Dîner & Coupons',
    serviceTab: 'Coin Service',
    close: 'Fermer',
    copyPassword: 'Copier',
    copiedToClipboard: 'Copié!',
    checkIn: 'Enregistrement',
    checkOut: 'Départ',
    planNote: '*Les heures peuvent varier selon le plan.',
    bathTitle: 'Bain public',
    bathDescription: 'Bain public séparé hommes/femmes \"Aoba no Yu\" 9F',
    operatingHours: 'Heures d\'ouverture:',
    bathHours: '15:00~Le lendemain 10:00',
    saunaNote: '(Sauna uniquement: 1:00~5:00 fermé)',
    notice: 'Avis',
    bathNotice1: '*Veuillez apporter vos propres serviettes et articles de toilette depuis votre chambre.',
    bathNotice2: '*Un code d\'accès est requis pour entrer dans le bain public des femmes. Le code sera fourni à la réception.',
    freeService: 'Service gratuit',
    bathServiceDesc: 'Nous fournissons gratuitement des boissons lactiques et des bonbons glacés.',
    breakfastTitle: 'Petit-déjeuner & Soba de nuit (Restaurant 1F)',
    breakfastPrice: '■Petit-déjeuner / ¥2,300',
    breakfastHours: '6:15~9:30 (Dernière entrée 9:00)',
    breakfastNote1: '*Vous pourriez être invité à attendre si le restaurant est complet.',
    breakfastNote2: '*Les heures d\'ouverture peuvent changer selon l\'affluence.',
    sobaTitle: '■Soba de nuit (Demi-portion) / Gratuit',
    sobaHours: '21:30~23:00',
    sobaNote: '*Les heures d\'ouverture peuvent changer.',
    serviceTitle: 'Coin Service',
    vendingMachine: 'Distributeur automatique',
    alcoholNote: '(Boissons alcoolisées: 5F, 9F)',
    microwave: 'Micro-ondes',
    iceMaker: 'Machine à glaçons',
    smoking: 'Espace fumeur',
    trouserPress: 'Presse-pantalon',
    trouserPressLocation: 'Devant l\'ascenseur à chaque étage',
    laundry: 'Coin Laverie',
    laundryNote: '*Détergent, machine à laver/gratuit, sèche-linge/payant (¥100 par 30 minutes)',
    wifiTitle: 'Wi-Fi',
    password: 'Mot de passe:',
    lostTitle: 'Objets trouvés',
    lostText1: 'En principe, l\'hôtel ne vous contactera pas concernant les objets perdus.',
    lostText2: 'S\'il n\'y a pas de contact, les objets seront éliminés après 3 mois conformément à la Loi sur les objets perdus.',
    lostText3: 'Cependant, les aliments et boissons seront éliminés le jour même.',
    lightingTitle: 'Éclairage intérieur',
    lightingDesc: 'Après être entré dans la chambre, insérez le porte-clés de votre chambre dans la prise électrique à côté de l\'entrée pour allumer l\'éclairage de la chambre.',
    lightingNote: 'Insérez la carte-clé dans la prise électrique.',
    longstayTitle: 'Pour les clients longue durée',
    sheetExchange: 'Les clients qui souhaitent échanger les draps, housses de futon et taies d\'oreiller, veuillez afficher la \"Carte WECO\" sur le lit. Nous ne les échangerons pas si la carte n\'est pas affichée. (Nous échangerons les serviettes et les vêtements de chambre.)',
    noCleaning: 'Les clients qui n\'ont pas besoin de nettoyage, veuillez afficher la carte verte \"WECO\" du côté du couloir, qui se trouve à l\'intérieur de la porte d\'entrée. Dans ce cas, nous ne nettoierons pas et n\'entrerons pas dans la chambre.',
    officialHP: 'Site Web officiel',
    preparing: 'Les informations détaillées sont en cours de préparation.',
  },
  de: {
    hotelName: 'Natürliche heiße Quelle Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Hotel-Führer',
    welcomeMessage: 'Vielen Dank, dass Sie heute im \"Natürliche heiße Quelle Aoba no Yu Dormy Inn Sendai ANNEX\" übernachtet haben.',
    welcomeMessage2: 'Wenn Sie Fragen haben, wenden Sie sich bitte an unsere Rezeption.',
    restaurantCoupon: 'Restaurant-Gutschein',
    checkInOut: 'Check-in/Check-out',
    bath: 'Öffentliches Bad',
    breakfast: 'Frühstück & Nacht-Soba',
    dinner: 'Abendessen & Gutscheine',
    dinnerCatchphrase: 'Wie wäre es mit dem Abendessen?',
    dinnerCouponLabel: 'Restaurant-Gutscheine',
    service: 'Service-Ecke',
    wifi: 'Wi-Fi',
    lighting: 'Raumbeleuchtung',
    longstay: 'Für Langzeitgäste',
    lost: 'Fundsachen',
    quickCheckin: 'Schnell-Check-in',
    dinnerTab: 'Abendessen & Gutscheine',
    serviceTab: 'Service-Ecke',
    close: 'Schließen',
    copyPassword: 'Kopieren',
    copiedToClipboard: 'Kopiert!',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    planNote: '*Die Zeiten können je nach Plan variieren.',
    bathTitle: 'Öffentliches Bad',
    bathDescription: 'Getrenntes Männer- und Frauenbad \"Aoba no Yu\" 9F',
    operatingHours: 'Öffnungszeiten:',
    bathHours: '15:00~Nächster Tag 10:00',
    saunaNote: '(Nur Sauna: 1:00~5:00 geschlossen)',
    notice: 'Hinweis',
    bathNotice1: '*Bitte bringen Sie Ihre eigenen Handtücher und Toilettenartikel aus Ihrem Zimmer mit.',
    bathNotice2: '*Ein Passcode ist erforderlich, um das Frauenbad zu betreten. Der Passcode wird an der Rezeption bereitgestellt.',
    freeService: 'Kostenloser Service',
    bathServiceDesc: 'Wir bieten kostenlos Milchsäuregetränke und Eisbonbons an.',
    breakfastTitle: 'Frühstück & Nacht-Soba (Restaurant 1F)',
    breakfastPrice: '■Frühstück / ¥2,300',
    breakfastHours: '6:15~9:30 (Letzter Einlass 9:00)',
    breakfastNote1: '*Sie könnten gebeten werden zu warten, wenn das Restaurant voll ist.',
    breakfastNote2: '*Die Öffnungszeiten können je nach Andrang geändert werden.',
    sobaTitle: '■Nacht-Soba (Halbportion) / Kostenlos',
    sobaHours: '21:30~23:00',
    sobaNote: '*Die Öffnungszeiten können sich ändern.',
    serviceTitle: 'Service-Ecke',
    vendingMachine: 'Verkaufsautomat',
    alcoholNote: '(Alkoholische Getränke: 5F, 9F)',
    microwave: 'Mikrowelle',
    iceMaker: 'Eismaschine',
    smoking: 'Raucherbereich',
    trouserPress: 'Hosenpresse',
    trouserPressLocation: 'Vor dem Aufzug auf jeder Etage',
    laundry: 'Waschecke',
    laundryNote: '*Waschmittel, Waschmaschine/kostenlos, Trockner/gebührenpflichtig (¥100 pro 30 Minuten)',
    wifiTitle: 'Wi-Fi',
    password: 'Passwort:',
    lostTitle: 'Fundsachen',
    lostText1: 'Grundsätzlich wird das Hotel Sie nicht bezüglich verlorener Gegenstände kontaktieren.',
    lostText2: 'Wenn kein Kontakt besteht, werden die Gegenstände nach 3 Monaten gemäß dem Fundrecht entsorgt.',
    lostText3: 'Lebensmittel und Getränke werden jedoch am selben Tag entsorgt.',
    lightingTitle: 'Raumbeleuchtung',
    lightingDesc: 'Nach dem Betreten des Zimmers stecken Sie den Zimmerschlüsselhalter in die Steckdose neben dem Eingang, um die Raumbeleuchtung einzuschalten.',
    lightingNote: 'Stecken Sie die Schlüsselkarte in die Steckdose.',
    longstayTitle: 'Für Langzeitgäste',
    sheetExchange: 'Gäste, die Bettwäsche, Futonbezüge und Kissenbezüge wechseln möchten, bitte zeigen Sie die \"WECO-Karte\" auf dem Bett. Wir tauschen sie nicht aus, wenn die Karte nicht angezeigt wird. (Wir tauschen Handtücher und Nachtwäsche aus.)',
    noCleaning: 'Gäste, die keine Reinigung benötigen, bitte zeigen Sie die grüne \"WECO\"-Karte auf der Korridorseite, die sich an der Innenseite der Eingangstür befindet. In diesem Fall reinigen wir nicht und betreten das Zimmer nicht.',
    officialHP: 'Offizielle Website',
    preparing: 'Detaillierte Informationen werden vorbereitet.',
  },
  es: {
    hotelName: 'Fuente termal natural Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Guía del hotel',
    welcomeMessage: 'Muchas gracias por alojarse hoy en \"Fuente termal natural Aoba no Yu Dormy Inn Sendai ANNEX\".',
    welcomeMessage2: 'Si tiene alguna pregunta, no dude en consultar a nuestro personal de recepción.',
    restaurantCoupon: 'Cupón de restaurante',
    checkInOut: 'Registro/Salida',
    bath: 'Baño público',
    breakfast: 'Desayuno & Soba nocturno',
    dinner: 'Cena & Cupones',
    dinnerCatchphrase: '¿Qué tal la cena esta noche?',
    dinnerCouponLabel: 'Cupones de restaurante',
    service: 'Rincón de servicio',
    wifi: 'Wi-Fi',
    lighting: 'Iluminación interior',
    longstay: 'Para huéspedes de larga estancia',
    lost: 'Objetos perdidos',
    quickCheckin: 'Check-in rápido',
    dinnerTab: 'Cena & Cupones',
    serviceTab: 'Rincón de servicio',
    close: 'Cerrar',
    copyPassword: 'Copiar',
    copiedToClipboard: '¡Copiado!',
    checkIn: 'Registro',
    checkOut: 'Salida',
    planNote: '*Los horarios pueden variar según el plan.',
    bathTitle: 'Baño público',
    bathDescription: 'Baño público separado para hombres y mujeres \"Aoba no Yu\" 9F',
    operatingHours: 'Horario de funcionamiento:',
    bathHours: '15:00~Día siguiente 10:00',
    saunaNote: '(Solo sauna: 1:00~5:00 cerrado)',
    notice: 'Aviso',
    bathNotice1: '*Por favor traiga sus propias toallas y artículos de aseo desde su habitación.',
    bathNotice2: '*Se requiere un código de acceso para entrar al baño público de mujeres. El código se proporcionará en la recepción.',
    freeService: 'Servicio gratuito',
    bathServiceDesc: 'Ofrecemos gratuitamente bebidas lácteas y caramelos de hielo.',
    breakfastTitle: 'Desayuno & Soba nocturno (Restaurante 1F)',
    breakfastPrice: '■Desayuno / ¥2,300',
    breakfastHours: '6:15~9:30 (Última entrada 9:00)',
    breakfastNote1: '*Es posible que se le pida que espere si el restaurante está lleno.',
    breakfastNote2: '*Los horarios de funcionamiento pueden cambiar según la congestión.',
    sobaTitle: '■Soba nocturno (Media porción) / Gratis',
    sobaHours: '21:30~23:00',
    sobaNote: '*Los horarios de funcionamiento pueden cambiar.',
    serviceTitle: 'Rincón de servicio',
    vendingMachine: 'Máquina expendedora',
    alcoholNote: '(Bebidas alcohólicas: 5F, 9F)',
    microwave: 'Microondas',
    iceMaker: 'Máquina de hielo',
    smoking: 'Área de fumadores',
    trouserPress: 'Prensa de pantalones',
    trouserPressLocation: 'Frente al ascensor en cada piso',
    laundry: 'Rincón de lavandería',
    laundryNote: '*Detergente, lavadora/gratis, secadora/de pago (¥100 por 30 minutos)',
    wifiTitle: 'Wi-Fi',
    password: 'Contraseña:',
    lostTitle: 'Objetos perdidos',
    lostText1: 'Como regla, el hotel no se pondrá en contacto con usted sobre objetos perdidos.',
    lostText2: 'Si no hay contacto, los objetos se eliminarán después de 3 meses de acuerdo con la Ley de Objetos Perdidos.',
    lostText3: 'Sin embargo, los alimentos y bebidas se eliminarán el mismo día.',
    lightingTitle: 'Iluminación interior',
    lightingDesc: 'Después de entrar en la habitación, inserte el portallaves de su habitación en el enchufe eléctrico junto a la entrada para encender la iluminación de la habitación.',
    lightingNote: 'Inserte la tarjeta llave en el enchufe eléctrico.',
    longstayTitle: 'Para huéspedes de larga estancia',
    sheetExchange: 'Los huéspedes que deseen cambiar las sábanas, fundas de futón y fundas de almohada, por favor muestren la \"Tarjeta WECO\" en la cama. No las cambiaremos si la tarjeta no se muestra. (Cambiaremos toallas y ropa de habitación.)',
    noCleaning: 'Los huéspedes que no necesiten limpieza, por favor muestren la tarjeta verde \"WECO\" en el lado del pasillo, que se encuentra en el interior de la puerta de entrada. En ese caso, no limpiaremos ni entraremos en la habitación.',
    officialHP: 'Sitio web oficial',
    preparing: 'La información detallada se está preparando.',
  },
  it: {
    hotelName: 'Sorgente termale naturale Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Guida dell\'hotel',
    welcomeMessage: 'Grazie mille per aver soggiornato oggi presso \"Sorgente termale naturale Aoba no Yu Dormy Inn Sendai ANNEX\".',
    welcomeMessage2: 'Se ha domande, non esiti a contattare il nostro personale della reception.',
    restaurantCoupon: 'Buono ristorante',
    checkInOut: 'Check-in/Check-out',
    bath: 'Bagno pubblico',
    breakfast: 'Colazione & Soba notturno',
    dinner: 'Cena & Buoni',
    dinnerCatchphrase: 'E per cena stasera?',
    dinnerCouponLabel: 'Buoni ristorante',
    service: 'Angolo servizio',
    wifi: 'Wi-Fi',
    lighting: 'Illuminazione interna',
    longstay: 'Per ospiti soggiorno prolungato',
    lost: 'Oggetti smarriti',
    quickCheckin: 'Check-in rapido',
    dinnerTab: 'Cena & Buoni',
    serviceTab: 'Angolo servizio',
    close: 'Chiudi',
    copyPassword: 'Copia',
    copiedToClipboard: 'Copiato!',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    planNote: '*Gli orari possono variare a seconda del piano.',
    bathTitle: 'Bagno pubblico',
    bathDescription: 'Bagno pubblico separato uomini/donne \"Aoba no Yu\" 9F',
    operatingHours: 'Orari di apertura:',
    bathHours: '15:00~Giorno successivo 10:00',
    saunaNote: '(Solo sauna: 1:00~5:00 chiuso)',
    notice: 'Avviso',
    bathNotice1: '*Si prega di portare i propri asciugamani e articoli da toilette dalla propria camera.',
    bathNotice2: '*È richiesto un codice di accesso per entrare nel bagno pubblico delle donne. Il codice verrà fornito alla reception.',
    freeService: 'Servizio gratuito',
    bathServiceDesc: 'Forniamo gratuitamente bevande lattiche e caramelle ghiacciate.',
    breakfastTitle: 'Colazione & Soba notturno (Ristorante 1F)',
    breakfastPrice: '■Colazione / ¥2,300',
    breakfastHours: '6:15~9:30 (Ultimo ingresso 9:00)',
    breakfastNote1: '*Potrebbe essere richiesto di attendere se il ristorante è pieno.',
    breakfastNote2: '*Gli orari di apertura possono cambiare a seconda della congestione.',
    sobaTitle: '■Soba notturno (Mezza porzione) / Gratis',
    sobaHours: '21:30~23:00',
    sobaNote: '*Gli orari di apertura possono cambiare.',
    serviceTitle: 'Angolo servizio',
    vendingMachine: 'Distributore automatico',
    alcoholNote: '(Bevande alcoliche: 5F, 9F)',
    microwave: 'Forno a microonde',
    iceMaker: 'Macchina per il ghiaccio',
    smoking: 'Area fumatori',
    trouserPress: 'Stiratrice pantaloni',
    trouserPressLocation: 'Davanti all\'ascensore su ogni piano',
    laundry: 'Angolo lavanderia',
    laundryNote: '*Detergente, lavatrice/gratis, asciugatrice/a pagamento (¥100 per 30 minuti)',
    wifiTitle: 'Wi-Fi',
    password: 'Password:',
    lostTitle: 'Oggetti smarriti',
    lostText1: 'Di norma, l\'hotel non vi contatterà riguardo agli oggetti smarriti.',
    lostText2: 'Se non c\'è contatto, gli oggetti verranno eliminati dopo 3 mesi secondo la Legge sugli Oggetti Smarriti.',
    lostText3: 'Tuttavia, cibi e bevande verranno eliminati lo stesso giorno.',
    lightingTitle: 'Illuminazione interna',
    lightingDesc: 'Dopo essere entrati nella camera, inserire il portachiavi della camera nella presa elettrica accanto all\'ingresso per accendere l\'illuminazione della camera.',
    lightingNote: 'Inserire la chiave magnetica nella presa elettrica.',
    longstayTitle: 'Per ospiti soggiorno prolungato',
    sheetExchange: 'Gli ospiti che desiderano cambiare lenzuola, coperture futon e federe, si prega di mostrare la \"Carta WECO\" sul letto. Non le cambieremo se la carta non viene mostrata. (Cambieremo asciugamani e abbigliamento da camera.)',
    noCleaning: 'Gli ospiti che non necessitano di pulizia, si prega di mostrare la carta verde \"WECO\" sul lato del corridoio, che si trova all\'interno della porta d\'ingresso. In tal caso, non puliremo né entreremo nella camera.',
    officialHP: 'Sito web ufficiale',
    preparing: 'Le informazioni dettagliate sono in preparazione.',
  },
  th: {
    hotelName: 'น้ำพุร้อนธรรมชาติ อาโอบะโนะยุ',
    hotelTitle: 'โดมิอินน์เซนได ANNEX',
    heroTitle: 'คู่มือโรงแรม',
    welcomeMessage: 'ขอบคุณมากที่เลือกพักที่ \"น้ำพุร้อนธรรมชาติ อาโอบะโนะยุ โดมิอินน์เซนไดเอคิมาเอะ\" วันนี้',
    welcomeMessage2: 'หากมีคำถามใดๆ กรุณาติดต่อเจ้าหน้าที่ฝ่ายต้อนรับ',
    restaurantCoupon: 'คูปองร้านอาหาร',
    checkInOut: 'เช็คอิน/เช็คเอาท์',
    bath: 'ห้องอาบน้ำสาธารณะ',
    breakfast: 'อาหารเช้า & โซบะยามดึก',
    dinner: 'อาหารเย็น & คูปอง',
    dinnerCatchphrase: 'มื้อเย็นคืนนี้เป็นอย่างไร?',
    dinnerCouponLabel: 'คูปองร้านอาหาร',
    service: 'มุมบริการ',
    wifi: 'Wi-Fi',
    lighting: 'ไฟภายในห้อง',
    longstay: 'สำหรับแขกพักต่อเนื่อง',
    lost: 'ของหาย',
    quickCheckin: 'เช็คอินด่วน',
    dinnerTab: 'อาหารเย็น & คูปอง',
    serviceTab: 'มุมบริการ',
    close: 'ปิด',
    copyPassword: 'คัดลอก',
    copiedToClipboard: 'คัดลอกแล้ว!',
    checkIn: 'เช็คอิน',
    checkOut: 'เช็คเอาท์',
    planNote: '*เวลาอาจแตกต่างกันตามแพ็คเกจ',
    bathTitle: 'ห้องอาบน้ำสาธารณะ',
    bathDescription: 'ห้องอาบน้ำสาธารณะแยกชาย-หญิง \"อาโอบะโนะยุ\" ชั้น 9',
    operatingHours: 'เวลาทำการ:',
    bathHours: '15:00~วันถัดไป 10:00',
    saunaNote: '(ซาวน่าเท่านั้น: 1:00~5:00 ปิด)',
    notice: 'ข้อควรระวัง',
    bathNotice1: '*กรุณานำผ้าเช็ดตัวและของใช้ส่วนตัวจากห้องของคุณ',
    bathNotice2: '*ต้องใช้รหัสผ่านเพื่อเข้าห้องอาบน้ำสาธารณะหญิง รหัสผ่านจะได้รับที่ฝ่ายต้อนรับ',
    freeService: 'บริการฟรี',
    bathServiceDesc: 'เรามีเครื่องดื่มแลคติกและไอศกรีมแท่งให้บริการฟรี',
    breakfastTitle: 'อาหารเช้า & โซบะยามดึก (ร้านอาหารชั้น 1)',
    breakfastPrice: '■อาหารเช้า / ¥2,300',
    breakfastHours: '6:15~9:30 (เข้าครั้งสุดท้าย 9:00)',
    breakfastNote1: '*อาจต้องรอหากร้านอาหารเต็ม',
    breakfastNote2: '*เวลาทำการอาจเปลี่ยนแปลงตามความแออัด',
    sobaTitle: '■โซบะยามดึก (ขนาดครึ่ง) / ฟรี',
    sobaHours: '21:30~23:00',
    sobaNote: '*เวลาทำการอาจเปลี่ยนแปลง',
    serviceTitle: 'มุมบริการ',
    vendingMachine: 'ตู้จำหน่ายสินค้าอัตโนมัติ',
    alcoholNote: '(เครื่องดื่มแอลกอฮอล์: ชั้น 5, 9)',
    microwave: 'ไมโครเวฟ',
    iceMaker: 'เครื่องทำน้ำแข็ง',
    smoking: 'พื้นที่สูบบุหรี่',
    trouserPress: 'เครื่องรีดกางเกง',
    trouserPressLocation: 'หน้าลิฟต์ทุกชั้น',
    laundry: 'มุมซักผ้า',
    laundryNote: '*ผงซักฟอก, เครื่องซักผ้า/ฟรี เครื่องอบผ้า/เสียค่าใช้จ่าย (¥100 ต่อ 30 นาที)',
    wifiTitle: 'Wi-Fi',
    password: 'รหัสผ่าน:',
    lostTitle: 'ของหาย',
    lostText1: 'โดยหลักการแล้ว โรงแรมจะไม่ติดต่อคุณเกี่ยวกับของหาย',
    lostText2: 'หากไม่มีการติดต่อ ของจะถูกกำจัดหลังจาก 3 เดือนตามกฎหมายทรัพย์สินหาย',
    lostText3: 'อย่างไรก็ตาม อาหารและเครื่องดื่มจะถูกกำจัดในวันเดียวกัน',
    lightingTitle: 'ไฟภายในห้อง',
    lightingDesc: 'หลังจากเข้าห้องแล้ว ให้เสียบที่แขวนกุญแจห้องเข้ากับเต้ารับไฟฟ้าข้างประตูทางเข้าเพื่อเปิดไฟภายในห้อง',
    lightingNote: 'เสียบคีย์การ์ดเข้ากับเต้ารับไฟฟ้า',
    longstayTitle: 'สำหรับแขกพักต่อเนื่อง',
    sheetExchange: 'แขกที่ต้องการเปลี่ยนผ้าปูที่นอน ผ้าคลุมฟูตง และปลอกหมอน กรุณาแสดง \"บัตร WECO\" บนเตียง เราจะไม่เปลี่ยนหากไม่แสดงบัตร (เราจะเปลี่ยนผ้าเช็ดตัวและชุดนอน)',
    noCleaning: 'แขกที่ไม่ต้องการทำความสะอาด กรุณาแสดงบัตร \"WECO\" สีเขียวทางด้านโถงทางเดิน ซึ่งอยู่ด้านในของประตูทางเข้า ในกรณีนี้เราจะไม่ทำความสะอาดและไม่เข้าห้อง',
    officialHP: 'เว็บไซต์อย่างเป็นทางการ',
    preparing: 'กำลังเตรียมข้อมูลรายละเอียด',
  },
  vi: {
    hotelName: 'Suối nước nóng thiên nhiên Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Hướng dẫn khách sạn',
    welcomeMessage: 'Cảm ơn bạn rất nhiều vì đã lưu trú tại \"Suối nước nóng thiên nhiên Aoba no Yu Dormy Inn Sendai ANNEX\" hôm nay.',
    welcomeMessage2: 'Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với nhân viên lễ tân của chúng tôi.',
    restaurantCoupon: 'Phiếu giảm giá nhà hàng',
    checkInOut: 'Nhận phòng/Trả phòng',
    bath: 'Phòng tắm công cộng',
    breakfast: 'Bữa sáng & Soba đêm khuya',
    dinner: 'Bữa tối & Phiếu giảm giá',
    dinnerCatchphrase: 'Bữa tối tối nay nhé?',
    dinnerCouponLabel: 'Phiếu giảm giá nhà hàng',
    service: 'Góc dịch vụ',
    wifi: 'Wi-Fi',
    lighting: 'Ánh sáng trong phòng',
    longstay: 'Dành cho khách lưu trú dài ngày',
    lost: 'Đồ thất lạc',
    quickCheckin: 'Check-in nhanh',
    dinnerTab: 'Bữa tối & Phiếu giảm giá',
    serviceTab: 'Góc dịch vụ',
    close: 'Đóng',
    copyPassword: 'Sao chép',
    copiedToClipboard: 'Đã sao chép!',
    checkIn: 'Nhận phòng',
    checkOut: 'Trả phòng',
    planNote: '*Thời gian có thể thay đổi tùy theo gói.',
    bathTitle: 'Phòng tắm công cộng',
    bathDescription: 'Phòng tắm công cộng riêng nam/nữ \"Aoba no Yu\" tầng 9',
    operatingHours: 'Giờ hoạt động:',
    bathHours: '15:00~Ngày hôm sau 10:00',
    saunaNote: '(Chỉ phòng xông hơi: 1:00~5:00 đóng cửa)',
    notice: 'Lưu ý',
    bathNotice1: '*Vui lòng mang theo khăn tắm và đồ dùng vệ sinh từ phòng của bạn.',
    bathNotice2: '*Cần mã số để vào phòng tắm công cộng dành cho nữ. Mã số sẽ được cung cấp tại lễ tân.',
    freeService: 'Dịch vụ miễn phí',
    bathServiceDesc: 'Chúng tôi cung cấp miễn phí đồ uống sữa chua và kẹo đá.',
    breakfastTitle: 'Bữa sáng & Soba đêm khuya (Nhà hàng tầng 1)',
    breakfastPrice: '■Bữa sáng / ¥2,300',
    breakfastHours: '6:15~9:30 (Vào lần cuối 9:00)',
    breakfastNote1: '*Bạn có thể được yêu cầu chờ nếu nhà hàng đầy.',
    breakfastNote2: '*Giờ hoạt động có thể thay đổi tùy theo tình trạng đông đúc.',
    sobaTitle: '■Soba đêm khuya (Nửa phần) / Miễn phí',
    sobaHours: '21:30~23:00',
    sobaNote: '*Giờ hoạt động có thể thay đổi.',
    serviceTitle: 'Góc dịch vụ',
    vendingMachine: 'Máy bán hàng tự động',
    alcoholNote: '(Đồ uống có cồn: tầng 5, 9)',
    microwave: 'Lò vi sóng',
    iceMaker: 'Máy làm đá',
    smoking: 'Khu vực hút thuốc',
    trouserPress: 'Máy là quần',
    trouserPressLocation: 'Trước thang máy mỗi tầng',
    laundry: 'Góc giặt ủi',
    laundryNote: '*Chất tẩy rửa, máy giặt/miễn phí, máy sấy/trả phí (¥100 mỗi 30 phút)',
    wifiTitle: 'Wi-Fi',
    password: 'Mật khẩu:',
    lostTitle: 'Đồ thất lạc',
    lostText1: 'Theo nguyên tắc, khách sạn sẽ không liên hệ với bạn về đồ thất lạc.',
    lostText2: 'Nếu không có liên hệ, đồ vật sẽ được xử lý sau 3 tháng theo Luật Tài sản Thất lạc.',
    lostText3: 'Tuy nhiên, thực phẩm và đồ uống sẽ được xử lý trong ngày.',
    lightingTitle: 'Ánh sáng trong phòng',
    lightingDesc: 'Sau khi vào phòng, cắm móc chìa khóa phòng vào ổ cắm điện bên cạnh lối vào để bật ánh sáng trong phòng.',
    lightingNote: 'Cắm thẻ khóa vào ổ cắm điện.',
    longstayTitle: 'Dành cho khách lưu trú dài ngày',
    sheetExchange: 'Khách muốn thay ga trải giường, vỏ chăn và vỏ gối, vui lòng đặt \"Thẻ WECO\" trên giường. Chúng tôi sẽ không thay nếu không có thẻ. (Chúng tôi sẽ thay khăn tắm và quần áo ngủ.)',
    noCleaning: 'Khách không cần dọn dẹp, vui lòng đặt thẻ xanh \"WECO\" về phía hành lang, nằm ở bên trong cửa ra vào. Trong trường hợp đó, chúng tôi sẽ không dọn dẹp và không vào phòng.',
    officialHP: 'Trang web chính thức',
    preparing: 'Thông tin chi tiết đang được chuẩn bị.',
  },
  id: {
    hotelName: 'Sumber air panas alami Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Panduan hotel',
    welcomeMessage: 'Terima kasih banyak telah menginap di \"Sumber air panas alami Aoba no Yu Dormy Inn Sendai ANNEX\" hari ini.',
    welcomeMessage2: 'Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi staf resepsionis kami.',
    restaurantCoupon: 'Kupon Restoran',
    checkInOut: 'Check-in/Check-out',
    bath: 'Pemandian umum',
    breakfast: 'Sarapan & Soba tengah malam',
    dinner: 'Makan malam & Kupon',
    dinnerCatchphrase: 'Bagaimana dengan makan malam nanti?',
    dinnerCouponLabel: 'Kupon restoran',
    service: 'Sudut Layanan',
    wifi: 'Wi-Fi',
    lighting: 'Pencahayaan dalam ruangan',
    longstay: 'Untuk tamu menginap lama',
    lost: 'Barang hilang',
    quickCheckin: 'Check-in cepat',
    dinnerTab: 'Makan malam & Kupon',
    serviceTab: 'Sudut Layanan',
    close: 'Tutup',
    copyPassword: 'Salin',
    copiedToClipboard: 'Disalin!',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    planNote: '*Waktu dapat bervariasi tergantung paket.',
    bathTitle: 'Pemandian umum',
    bathDescription: 'Pemandian umum terpisah pria/wanita \"Aoba no Yu\" lantai 9',
    operatingHours: 'Jam operasional:',
    bathHours: '15:00~Hari berikutnya 10:00',
    saunaNote: '(Hanya sauna: 1:00~5:00 tutup)',
    notice: 'Pemberitahuan',
    bathNotice1: '*Harap bawa handuk dan perlengkapan mandi Anda sendiri dari kamar.',
    bathNotice2: '*Kode akses diperlukan untuk memasuki pemandian umum wanita. Kode akan diberikan di resepsionis.',
    freeService: 'Layanan gratis',
    bathServiceDesc: 'Kami menyediakan minuman asam laktat dan permen es secara gratis.',
    breakfastTitle: 'Sarapan & Soba tengah malam (Restoran lantai 1)',
    breakfastPrice: '■Sarapan / ¥2,300',
    breakfastHours: '6:15~9:30 (Masuk terakhir 9:00)',
    breakfastNote1: '*Anda mungkin diminta menunggu jika restoran penuh.',
    breakfastNote2: '*Jam operasional dapat berubah tergantung kepadatan.',
    sobaTitle: '■Soba tengah malam (Setengah porsi) / Gratis',
    sobaHours: '21:30~23:00',
    sobaNote: '*Jam operasional dapat berubah.',
    serviceTitle: 'Sudut Layanan',
    vendingMachine: 'Mesin penjual otomatis',
    alcoholNote: '(Minuman beralkohol: lantai 5, 9)',
    microwave: 'Microwave',
    iceMaker: 'Pembuat es',
    smoking: 'Area merokok',
    trouserPress: 'Penyetrika celana',
    trouserPressLocation: 'Di depan lift setiap lantai',
    laundry: 'Sudut Laundry',
    laundryNote: '*Deterjen, mesin cuci/gratis, pengering/berbayar (¥100 per 30 menit)',
    wifiTitle: 'Wi-Fi',
    password: 'Kata sandi:',
    lostTitle: 'Barang hilang',
    lostText1: 'Sebagai aturan, hotel tidak akan menghubungi Anda mengenai barang hilang.',
    lostText2: 'Jika tidak ada kontak, barang akan dibuang setelah 3 bulan sesuai dengan Undang-Undang Barang Hilang.',
    lostText3: 'Namun, makanan dan minuman akan dibuang pada hari yang sama.',
    lightingTitle: 'Pencahayaan dalam ruangan',
    lightingDesc: 'Setelah memasuki kamar, masukkan gantungan kunci kamar ke stopkontak listrik di samping pintu masuk untuk menyalakan pencahayaan dalam ruangan.',
    lightingNote: 'Masukkan kartu kunci ke stopkontak listrik.',
    longstayTitle: 'Untuk tamu menginap lama',
    sheetExchange: 'Tamu yang ingin mengganti seprai, penutup futon, dan sarung bantal, harap tampilkan \"Kartu WECO\" di tempat tidur. Kami tidak akan menggantinya jika kartu tidak ditampilkan. (Kami akan mengganti handuk dan pakaian kamar.)',
    noCleaning: 'Tamu yang tidak memerlukan pembersihan, harap tampilkan kartu hijau \"WECO\" di sisi koridor, yang terletak di dalam pintu masuk. Dalam hal ini, kami tidak akan membersihkan atau memasuki kamar.',
    officialHP: 'Situs web resmi',
    preparing: 'Informasi rinci sedang disiapkan.',
  },
  pt: {
    hotelName: 'Fonte termal natural Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Guia do hotel',
    welcomeMessage: 'Muito obrigado por se hospedar hoje no \"Fonte termal natural Aoba no Yu Dormy Inn Sendai ANNEX\".',
    welcomeMessage2: 'Se tiver alguma dúvida, não hesite em consultar nossa equipe de recepção.',
    restaurantCoupon: 'Cupom de restaurante',
    checkInOut: 'Check-in/Check-out',
    bath: 'Banho público',
    breakfast: 'Café da manhã & Soba noturno',
    dinner: 'Jantar & Cupons',
    dinnerCatchphrase: 'Que tal o jantar esta noite?',
    dinnerCouponLabel: 'Cupons de restaurante',
    service: 'Canto de Serviço',
    wifi: 'Wi-Fi',
    lighting: 'Iluminação interna',
    longstay: 'Para hóspedes de longa estadia',
    lost: 'Objetos perdidos',
    quickCheckin: 'Check-in rápido',
    dinnerTab: 'Jantar & Cupons',
    serviceTab: 'Canto de Serviço',
    close: 'Fechar',
    copyPassword: 'Copiar',
    copiedToClipboard: 'Copiado!',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    planNote: '*Os horários podem variar dependendo do plano.',
    bathTitle: 'Banho público',
    bathDescription: 'Banho público separado para homens e mulheres \"Aoba no Yu\" 9F',
    operatingHours: 'Horário de funcionamento:',
    bathHours: '15:00~Dia seguinte 10:00',
    saunaNote: '(Apenas sauna: 1:00~5:00 fechado)',
    notice: 'Aviso',
    bathNotice1: '*Por favor, traga suas próprias toalhas e artigos de higiene do seu quarto.',
    bathNotice2: '*É necessário um código de acesso para entrar no banho público feminino. O código será fornecido na recepção.',
    freeService: 'Serviço gratuito',
    bathServiceDesc: 'Oferecemos gratuitamente bebidas lácteas e doces gelados.',
    breakfastTitle: 'Café da manhã & Soba noturno (Restaurante 1F)',
    breakfastPrice: '■Café da manhã / ¥2,300',
    breakfastHours: '6:15~9:30 (Última entrada 9:00)',
    breakfastNote1: '*Você pode ser solicitado a esperar se o restaurante estiver cheio.',
    breakfastNote2: '*Os horários de funcionamento podem mudar dependendo do congestionamento.',
    sobaTitle: '■Soba noturno (Meia porção) / Grátis',
    sobaHours: '21:30~23:00',
    sobaNote: '*Os horários de funcionamento podem mudar.',
    serviceTitle: 'Canto de Serviço',
    vendingMachine: 'Máquina de venda automática',
    alcoholNote: '(Bebidas alcoólicas: 5F, 9F)',
    microwave: 'Microondas',
    iceMaker: 'Máquina de gelo',
    smoking: 'Área para fumantes',
    trouserPress: 'Prensa de calças',
    trouserPressLocation: 'Em frente ao elevador em cada andar',
    laundry: 'Canto de Lavanderia',
    laundryNote: '*Detergente, máquina de lavar/grátis, secadora/paga (¥100 por 30 minutos)',
    wifiTitle: 'Wi-Fi',
    password: 'Senha:',
    lostTitle: 'Objetos perdidos',
    lostText1: 'Como regra, o hotel não entrará em contato com você sobre objetos perdidos.',
    lostText2: 'Se não houver contato, os objetos serão descartados após 3 meses de acordo com a Lei de Objetos Perdidos.',
    lostText3: 'No entanto, alimentos e bebidas serão descartados no mesmo dia.',
    lightingTitle: 'Iluminação interna',
    lightingDesc: 'Após entrar no quarto, insira o porta-chaves do quarto na tomada elétrica ao lado da entrada para acender a iluminação do quarto.',
    lightingNote: 'Insira o cartão-chave na tomada elétrica.',
    longstayTitle: 'Para hóspedes de longa estadia',
    sheetExchange: 'Hóspedes que desejam trocar lençóis, capas de futon e fronhas, por favor mostrem o \"Cartão WECO\" na cama. Não os trocaremos se o cartão não for mostrado. (Trocaremos toalhas e roupas de quarto.)',
    noCleaning: 'Hóspedes que não precisam de limpeza, por favor mostrem o cartão verde \"WECO\" no lado do corredor, que está localizado no interior da porta de entrada. Nesse caso, não limparemos nem entraremos no quarto.',
    officialHP: 'Site oficial',
    preparing: 'Informações detalhadas estão sendo preparadas.',
  },
  el: {
    hotelName: 'Φυσική θερμή πηγή Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Οδηγός ξενοδοχείου',
    welcomeMessage: 'Σας ευχαριστούμε πολύ που μείνατε σήμερα στο \"Φυσική θερμή πηγή Aoba no Yu Dormy Inn Sendai ANNEX\".',
    welcomeMessage2: 'Εάν έχετε οποιεσδήποτε ερωτήσεις, μη διστάσετε να ρωτήσετε το προσωπικό υποδοχής μας.',
    restaurantCoupon: 'Κουπόνι εστιατορίου',
    checkInOut: 'Ώρα check-in/check-out',
    bath: 'Δημόσιο λουτρό',
    breakfast: 'Πρωινό και νυχτερινή soba',
    dinner: 'Δείπνο και κουπόνια',
    dinnerCatchphrase: 'Τι λέτε για δείπνο απόψε;',
    dinnerCouponLabel: 'Κουπόνια εστιατορίου',
    service: 'Γωνία εξυπηρέτησης',
    wifi: 'Wi-Fi',
    lighting: 'Φωτισμός δωματίου',
    longstay: 'Για μακροπρόθεσμους επισκέπτες',
    lost: 'Χαμένα αντικείμενα',
    quickCheckin: 'Γρήγορο Check-in',
    dinnerTab: 'Δείπνο και κουπόνια',
    serviceTab: 'Γωνία εξυπηρέτησης',
    close: 'Κλείσιμο',
    copyPassword: 'Αντιγραφή',
    copiedToClipboard: 'Αντιγράφηκε!',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    planNote: '*Οι ώρες μπορεί να διαφέρουν ανάλογα με το πρόγραμμα.',
    bathTitle: 'Δημόσιο λουτρό',
    bathDescription: 'Ξεχωριστά δημόσια λουτρά για άνδρες και γυναίκες \"Aoba no Yu\" 9F',
    operatingHours: 'Ώρες λειτουργίας:',
    bathHours: '15:00~Επόμενη ημέρα 10:00',
    saunaNote: '(Μόνο σάουνα: 1:00~5:00 κλειστό)',
    notice: 'Ειδοποίηση',
    bathNotice1: '*Παρακαλώ φέρετε τις δικές σας πετσέτες και αξεσουάρ από το δωμάτιό σας.',
    bathNotice2: '*Απαιτείται κωδικός πρόσβασης για να εισέλθετε στο δημόσιο λουτρό γυναικών. Ο κωδικός θα παρέχεται στην υποδοχή.',
    freeService: 'Δωρεάν υπηρεσία',
    bathServiceDesc: 'Παρέχουμε δωρεάν ποτά γαλακτικού οξέος και καραμέλες πάγου.',
    breakfastTitle: 'Πρωινό και νυχτερινή soba (Εστιατόριο 1F)',
    breakfastPrice: '■Πρωινό / ¥2,300',
    breakfastHours: '6:15~9:30 (Τελευταία είσοδος 9:00)',
    breakfastNote1: '*Μπορεί να σας ζητηθεί να περιμένετε εάν το εστιατόριο είναι γεμάτο.',
    breakfastNote2: '*Οι ώρες λειτουργίας μπορεί να αλλάξουν ανάλογα με τη συμφόρηση.',
    sobaTitle: '■Νυχτερινή soba (Μισό μέγεθος) / Δωρεάν',
    sobaHours: '21:30~23:00',
    sobaNote: '*Οι ώρες λειτουργίας μπορεί να αλλάξουν.',
    serviceTitle: 'Γωνία εξυπηρέτησης',
    vendingMachine: 'Αυτόματη μηχανή',
    alcoholNote: '(Αλκοολούχα ποτά: 5F, 9F)',
    microwave: 'Φούρνος μικροκυμάτων',
    iceMaker: 'Μηχανή πάγου',
    smoking: 'Χώρος καπνίσματος',
    trouserPress: 'Πρέσα παντελονιού',
    trouserPressLocation: 'Μπροστά από το ασανσέρ σε κάθε όροφο',
    laundry: 'Γωνία πλυντηρίου',
    laundryNote: '*Απορρυπαντικό, πλυντήριο/δωρεάν, στεγνωτήριο/πληρωμένο (¥100 ανά 30 λεπτά)',
    wifiTitle: 'Wi-Fi',
    password: 'Κωδικός:',
    lostTitle: 'Χαμένα αντικείμενα',
    lostText1: 'Κατά κανόνα, το ξενοδοχείο δεν θα επικοινωνήσει μαζί σας σχετικά με χαμένα αντικείμενα.',
    lostText2: 'Εάν δεν υπάρχει επικοινωνία, τα αντικείμενα θα απορριφθούν μετά από 3 μήνες σύμφωνα με τον Νόμο για τα χαμένα αντικείμενα.',
    lostText3: 'Ωστόσο, τα τρόφιμα και τα ποτά θα απορριφθούν την ίδια ημέρα.',
    lightingTitle: 'Φωτισμός δωματίου',
    lightingDesc: 'Μετά την είσοδο στο δωμάτιο, τοποθετήστε τον κρατήρα κλειδιού του δωματίου στην ηλεκτρική πρίζα δίπλα στην είσοδο για να ενεργοποιήσετε τον φωτισμό του δωματίου.',
    lightingNote: 'Τοποθετήστε την κάρτα-κλειδί στην ηλεκτρική πρίζα.',
    longstayTitle: 'Για μακροπρόθεσμους επισκέπτες',
    sheetExchange: 'Επισκέπτες που επιθυμούν να αλλάξουν σεντόνια, καλύμματα futon και καλύμματα μαξιλαριών, παρακαλώ τοποθετήστε την \"Κάρτα WECO\" στο κρεβάτι. Δεν θα τα αλλάξουμε εάν η κάρτα δεν εμφανίζεται. (Θα αλλάξουμε πετσέτες και ρούχα δωματίου.)',
    noCleaning: 'Επισκέπτες που δεν χρειάζονται καθαρισμό, παρακαλώ τοποθετήστε την πράσινη κάρτα \"WECO\" στην πλευρά του διαδρόμου, η οποία βρίσκεται στο εσωτερικό της εισόδου. Σε αυτή την περίπτωση, δεν θα καθαρίσουμε ούτε θα εισέλθουμε στο δωμάτιο.',
    officialHP: 'Επίσημη ιστοσελίδα',
    preparing: 'Οι λεπτομερείς πληροφορίες προετοιμάζονται.',
  },
  tl: {
    hotelName: 'Natural na Mainit na Bukal Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Gabay sa Hotel',
    welcomeMessage: 'Maraming salamat sa pagtigil sa \"Natural na Mainit na Bukal Aoba no Yu Dormy Inn Sendai ANNEX\" ngayon.',
    welcomeMessage2: 'Kung mayroon kang anumang mga katanungan, mangyaring huwag mag-atubiling magtanong sa aming front desk staff.',
    restaurantCoupon: 'Restaurant Coupon',
    checkInOut: 'Check-in/Check-out',
    bath: 'Pampublikong Paliguan',
    breakfast: 'Almusal at Late Night Soba',
    dinner: 'Hapunan at Coupons',
    dinnerCatchphrase: 'How about dinner tonight?',
    dinnerCouponLabel: 'Restaurant Coupons',
    service: 'Service Corner',
    wifi: 'Wi-Fi',
    lighting: 'Ilaw sa Kwarto',
    longstay: 'Para sa Long-term Guests',
    lost: 'Nawawalang Bagay',
    quickCheckin: 'Quick Check-in',
    dinnerTab: 'Hapunan at Coupons',
    serviceTab: 'Service Corner',
    close: 'Isara',
    copyPassword: 'Kopyahin',
    copiedToClipboard: 'Nakopya!',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    planNote: '*Maaaring mag-iba ang oras depende sa plan.',
    bathTitle: 'Pampublikong Paliguan',
    bathDescription: 'Hiwalay na pampublikong paliguan para sa lalaki at babae \"Aoba no Yu\" 9F',
    operatingHours: 'Oras ng Operasyon:',
    bathHours: '15:00~Susunod na araw 10:00',
    saunaNote: '(Sauna lamang: 1:00~5:00 sarado)',
    notice: 'Paalala',
    bathNotice1: '*Mangyaring magdala ng sariling tuwalya at amenities mula sa inyong kwarto.',
    bathNotice2: '*Kailangan ng passcode para pumasok sa pampublikong paliguan ng babae. Ang passcode ay ibibigay sa front desk.',
    freeService: 'Libreng Serbisyo',
    bathServiceDesc: 'Nagbibigay kami ng libreng lactic acid drinks at ice candy.',
    breakfastTitle: 'Almusal at Late Night Soba (Restaurant 1F)',
    breakfastPrice: '■Almusal / ¥2,300',
    breakfastHours: '6:15~9:30 (Huling pagpasok 9:00)',
    breakfastNote1: '*Maaari kang hilingin na maghintay kung puno ang restaurant.',
    breakfastNote2: '*Maaaring magbago ang oras ng operasyon depende sa dami ng tao.',
    sobaTitle: '■Late Night Soba (Half Size) / Libre',
    sobaHours: '21:30~23:00',
    sobaNote: '*Maaaring magbago ang oras ng operasyon.',
    serviceTitle: 'Service Corner',
    vendingMachine: 'Vending Machine',
    alcoholNote: '(Alcoholic beverages: 5F, 9F)',
    microwave: 'Microwave',
    iceMaker: 'Ice Maker',
    smoking: 'Smoking Area',
    trouserPress: 'Trouser Press',
    trouserPressLocation: 'Sa harap ng elevator sa bawat palapag',
    laundry: 'Laundry Corner',
    laundryNote: '*Detergent, washing machine/libre, dryer/bayad (¥100 bawat 30 minuto)',
    wifiTitle: 'Wi-Fi',
    password: 'Password:',
    lostTitle: 'Nawawalang Bagay',
    lostText1: 'Bilang panuntunan, hindi makikipag-ugnayan ang hotel sa iyo tungkol sa nawawalang bagay.',
    lostText2: 'Kung walang kontak, itatapon ang mga bagay pagkatapos ng 3 buwan alinsunod sa Lost Property Act.',
    lostText3: 'Gayunpaman, ang pagkain at inumin ay itatapon sa parehong araw.',
    lightingTitle: 'Ilaw sa Kwarto',
    lightingDesc: 'Pagkatapos pumasok sa kwarto, isaksak ang room key holder sa power socket sa tabi ng pasukan upang buksan ang ilaw ng kwarto.',
    lightingNote: 'Isaksak ang key card sa power socket.',
    longstayTitle: 'Para sa Long-term Guests',
    sheetExchange: 'Ang mga bisita na nais magpalit ng kumot, futon covers, at pillowcases, mangyaring ipakita ang \"WECO Card\" sa kama. Hindi namin sila papalitan kung hindi ipapakita ang card. (Papalitan namin ang mga tuwalya at room wear.)',
    noCleaning: 'Ang mga bisita na hindi nangangailangan ng paglilinis, mangyaring ipakita ang berdeng \"WECO\" card sa corridor side, na matatagpuan sa loob ng entrance door. Sa kasong iyon, hindi namin lilinisin o papasok sa kwarto.',
    officialHP: 'Opisyal na Website',
    preparing: 'Ang detalyadong impormasyon ay inihahanda.',
  },
  ms: {
    hotelName: 'Mata Air Panas Semula Jadi Aoba no Yu',
    hotelTitle: 'Dormy Inn Sendai ANNEX',
    heroTitle: 'Panduan Hotel',
    welcomeMessage: 'Terima kasih banyak kerana menginap di \"Mata Air Panas Semula Jadi Aoba no Yu Dormy Inn Sendai ANNEX\" hari ini.',
    welcomeMessage2: 'Jika anda mempunyai sebarang soalan, sila jangan teragak-agak untuk bertanya kepada kakitangan kaunter hadapan kami.',
    restaurantCoupon: 'Kupon Restoran',
    checkInOut: 'Check-in/Check-out',
    bath: 'Mandi Awam',
    breakfast: 'Sarapan & Soba Malam',
    dinner: 'Makan Malam & Kupon',
    dinnerCatchphrase: 'Bagaimana dengan makan malam?',
    dinnerCouponLabel: 'Kupon restoran',
    service: 'Sudut Perkhidmatan',
    wifi: 'Wi-Fi',
    lighting: 'Pencahayaan Bilik',
    longstay: 'Untuk Tetamu Jangka Panjang',
    lost: 'Barang Hilang',
    quickCheckin: 'Check-in cepat',
    dinnerTab: 'Makan Malam & Kupon',
    serviceTab: 'Sudut Perkhidmatan',
    close: 'Tutup',
    copyPassword: 'Salin',
    copiedToClipboard: 'Disalin!',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    planNote: '*Masa mungkin berbeza bergantung pada pelan.',
    bathTitle: 'Mandi Awam',
    bathDescription: 'Mandi awam berasingan untuk lelaki dan wanita \"Aoba no Yu\" 9F',
    operatingHours: 'Waktu Operasi:',
    bathHours: '15:00~Hari berikutnya 10:00',
    saunaNote: '(Hanya sauna: 1:00~5:00 ditutup)',
    notice: 'Notis',
    bathNotice1: '*Sila bawa tuala dan kelengkapan anda sendiri dari bilik anda.',
    bathNotice2: '*Kod laluan diperlukan untuk memasuki mandi awam wanita. Kod akan disediakan di kaunter hadapan.',
    freeService: 'Perkhidmatan Percuma',
    bathServiceDesc: 'Kami menyediakan minuman asid laktik dan gula-gula ais secara percuma.',
    breakfastTitle: 'Sarapan & Soba Malam (Restoran 1F)',
    breakfastPrice: '■Sarapan / ¥2,300',
    breakfastHours: '6:15~9:30 (Kemasukan terakhir 9:00)',
    breakfastNote1: '*Anda mungkin diminta menunggu jika restoran penuh.',
    breakfastNote2: '*Waktu operasi mungkin berubah bergantung pada kesesakan.',
    sobaTitle: '■Soba Malam (Saiz Separuh) / Percuma',
    sobaHours: '21:30~23:00',
    sobaNote: '*Waktu operasi mungkin berubah.',
    serviceTitle: 'Sudut Perkhidmatan',
    vendingMachine: 'Mesin Jualan',
    alcoholNote: '(Minuman beralkohol: 5F, 9F)',
    microwave: 'Ketuhar Gelombang Mikro',
    iceMaker: 'Pembuat Ais',
    smoking: 'Kawasan Merokok',
    trouserPress: 'Penekan Seluar',
    trouserPressLocation: 'Di hadapan lif di setiap tingkat',
    laundry: 'Sudut Dobi',
    laundryNote: '*Detergen, mesin basuh/percuma, pengering/bayar (¥100 setiap 30 minit)',
    wifiTitle: 'Wi-Fi',
    password: 'Kata Laluan:',
    lostTitle: 'Barang Hilang',
    lostText1: 'Sebagai peraturan, hotel tidak akan menghubungi anda mengenai barang hilang.',
    lostText2: 'Jika tiada hubungan, barang akan dibuang selepas 3 bulan mengikut Akta Harta Hilang.',
    lostText3: 'Walau bagaimanapun, makanan dan minuman akan dibuang pada hari yang sama.',
    lightingTitle: 'Pencahayaan Bilik',
    lightingDesc: 'Selepas memasuki bilik, masukkan pemegang kunci bilik ke dalam soket kuasa di sebelah pintu masuk untuk menghidupkan pencahayaan bilik.',
    lightingNote: 'Masukkan kad kunci ke dalam soket kuasa.',
    longstayTitle: 'Untuk Tetamu Jangka Panjang',
    sheetExchange: 'Tetamu yang ingin menukar cadar, penutup futon, dan sarung bantal, sila paparkan \"Kad WECO\" di atas katil. Kami tidak akan menukarnya jika kad tidak dipaparkan. (Kami akan menukar tuala dan pakaian bilik.)',
    noCleaning: 'Tetamu yang tidak memerlukan pembersihan, sila paparkan kad hijau \"WECO\" di sebelah koridor, yang terletak di bahagian dalam pintu masuk. Dalam kes itu, kami tidak akan membersihkan atau memasuki bilik.',
    officialHP: 'Laman Web Rasmi',
    preparing: 'Maklumat terperinci sedang disediakan.',
  },
  'zh-TW': {
    hotelName: '天然溫泉 青葉之湯',
    hotelTitle: '多米酒店仙台ANNEX',
    heroTitle: '酒店內指南',
    welcomeMessage: '非常感謝您今天入住「天然溫泉 青葉之湯多米酒店仙台ANNEX」。',
    welcomeMessage2: '如有任何疑問，請隨時諮詢前台工作人員。',
    restaurantCoupon: '餐廳優惠券',
    checkInOut: '入住/退房時間',
    bath: '大浴場',
    breakfast: '早餐・夜鳴蕎麥麵',
    dinner: '晚餐・優惠券',
    dinnerCatchphrase: '今晚的晚餐',
    dinnerCouponLabel: '餐廳優惠券',
    service: '服務角',
    wifi: 'Wi-Fi',
    lighting: '室內照明',
    longstay: '長期住宿客人',
    lost: '遺失物品',
    quickCheckin: '快速入住',
    dinnerTab: '晚餐・優惠券',
    serviceTab: '服務角',
    close: '關閉',
    copyPassword: '複製',
    copiedToClipboard: '已複製!',
    checkIn: '入住',
    checkOut: '退房',
    planNote: '※根據套餐不同，時間可能有所不同。',
    bathTitle: '大浴場',
    bathDescription: '男女分開大浴場「青葉之湯」9F',
    operatingHours: '營業時間:',
    bathHours: '15:00~次日10:00',
    saunaNote: '(僅桑拿: 1:00~5:00停止)',
    notice: '注意',
    bathNotice1: '※請自備毛巾和用品從房間帶來。',
    bathNotice2: '※進入女性大浴場需要密碼。密碼將在前台提供。',
    freeService: '免費服務',
    bathServiceDesc: '我們免費提供乳酸飲料和冰棒。',
    breakfastTitle: '早餐與夜鳴蕎麥麵 (1F 餐廳)',
    breakfastPrice: '■早餐 / ¥2,300',
    breakfastHours: '6:15~9:30 (最後入店9:00)',
    breakfastNote1: '※如果餐廳滿座，可能需要等待。',
    breakfastNote2: '※營業時間可能會根據擁擠情況而改變。',
    sobaTitle: '■夜鳴蕎麥麵 (半份) / 免費',
    sobaHours: '21:30~23:00',
    sobaNote: '※營業時間可能會改變。',
    serviceTitle: '服務角',
    vendingMachine: '自動販賣機',
    alcoholNote: '(酒精飲料: 5F, 9F)',
    microwave: '微波爐',
    iceMaker: '製冰機',
    smoking: '吸煙區',
    trouserPress: '褲子壓燙機',
    trouserPressLocation: '各層電梯前',
    laundry: '洗衣角',
    laundryNote: '※洗滌劑、洗衣機/免費、烘乾機/付費(30分鐘¥100)',
    wifiTitle: 'Wi-Fi',
    password: '密碼:',
    lostTitle: '遺失物品',
    lostText1: '原則上，酒店不會就遺失物品與您聯繫。',
    lostText2: '如果沒有聯繫，物品將在3個月後根據遺失物品法處理。',
    lostText3: '但是，食品和飲料將在同一天處理。',
    lightingTitle: '室內照明',
    lightingDesc: '進入房間後，將房間鑰匙扣插入入口旁邊的電源插座以打開房間照明。',
    lightingNote: '請將房卡插入電源插座。',
    longstayTitle: '長期住宿客人',
    sheetExchange: '希望更換床單、被套和枕套的客人，請在床上展示「WECO卡」。如果未展示卡片，我們不會更換。(我們會更換毛巾和房間衣物。)',
    noCleaning: '不需要清潔的客人，請在走廊側展示位於入口門內側的綠色「WECO」卡。在這種情況下，我們不會清潔或進入房間。',
    officialHP: '官方網站',
    preparing: '詳細信息正在準備中。',
  },
};

export default function Home() {
  const { language: selectedLanguage, setLanguage: setSelectedLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('service');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showOtherLanguages, setShowOtherLanguages] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const servicesGridRef = useRef<HTMLDivElement>(null);
  const [visibleServices, setVisibleServices] = useState<Set<string>>(new Set());
  const [wifiPasswordCopied, setWifiPasswordCopied] = useState(false);

  const copyWifiPassword = async () => {
    try {
      await navigator.clipboard.writeText('dormyinn1234');
      setWifiPasswordCopied(true);
      setTimeout(() => setWifiPasswordCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = 'dormyinn1234';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setWifiPasswordCopied(true);
      setTimeout(() => setWifiPasswordCopied(false), 2000);
    }
  };

  const heroImages = [
    '/hotel-front-annex.jpg',
    '/hotel-bath.png',
    '/mornig.png',
  ];

  const t = translations[selectedLanguage as keyof typeof translations] || translations['en'];

  // 画像のスライドショー（4秒ごとに切り替え）
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // サービスアイコンのスクロールアニメーション
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const serviceId = entry.target.getAttribute('data-service-id');
            if (serviceId) {
              setVisibleServices((prev) => new Set(prev).add(serviceId));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const serviceElements = servicesGridRef.current?.querySelectorAll('[data-service-id]');
    serviceElements?.forEach((el) => observer.observe(el));

    return () => {
      serviceElements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // ドロップダウン外をクリックした時に閉じる
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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOtherLanguages]);

  const services = [
    { 
      icon: (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
          <Image
            src="/icon-matome/icon-carry.png"
            alt={t.checkInOut}
            width={112}
            height={112}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ), 
      titleKey: 'checkInOut' as const,
      id: 'checkin',
      textColor: 'text-blue-800'
    },
    { 
      icon: (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
          <Image
            src="/icon-matome/icon-bath.png"
            alt={t.bath}
            width={112}
            height={112}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ), 
      titleKey: 'bath' as const,
      id: 'bath',
      textColor: 'text-blue-800'
    },
    { 
      icon: (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
          <Image
            src="/icon-matome/icon-food.png"
            alt={t.breakfast}
            width={112}
            height={112}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ), 
      titleKey: 'breakfast' as const,
      id: 'breakfast',
      textColor: 'text-blue-800'
    },
    { 
      icon: (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
          <Image
            src="/icon-matome/icon-washmachine.png"
            alt={t.service}
            width={112}
            height={112}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ), 
      titleKey: 'service' as const,
      id: 'service',
      textColor: 'text-blue-800'
    },
    { 
      icon: (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
          <Image
            src="/icon-matome/icon-Wifi.png"
            alt={t.wifi}
            width={112}
            height={112}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ), 
      titleKey: 'wifi' as const,
      id: 'wifi',
      textColor: 'text-blue-800'
    },
    { 
      icon: (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
          <Image
            src="/icon-matome/icon-light.png"
            alt={t.lighting}
            width={112}
            height={112}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ), 
      titleKey: 'lighting' as const,
      id: 'lighting',
      textColor: 'text-blue-800'
    },
    { 
      icon: (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
          <Image
            src="/icon-matome/icon-bed.png"
            alt={t.longstay}
            width={112}
            height={112}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ), 
      titleKey: 'longstay' as const,
      id: 'longstay',
      textColor: 'text-blue-800'
    },
    { 
      icon: (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
          <Image
            src="/icon-matome/icon-tool.png"
            alt={t.lost}
            width={112}
            height={112}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ), 
      titleKey: 'lost' as const,
      id: 'lost',
      textColor: 'text-blue-800'
    },
    { 
      icon: (
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center shrink-0">
          <Image
            src="/430254.jpg"
            alt={t.quickCheckin}
            width={144}
            height={144}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
      ), 
      titleKey: 'quickCheckin' as const,
      id: 'quickCheckin',
      textColor: 'text-blue-800'
    },
    { 
      icon: null,
      titleKey: 'dinner' as const,
      id: 'dinner', 
      highlighted: true,
      textColor: 'text-white'
    },
  ];

  const mainLanguages = [
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'zh', flag: '🇨🇳', label: '中文' },
    { code: 'zh-TW', flag: '🇹🇼', label: '繁體中文' },
    { code: 'ko', flag: '🇰🇷', label: '한국어' },
    { code: 'ja', flag: '🇯🇵', label: '日本語' },
  ];

  const otherLanguages = [
    { code: 'th', flag: '🇹🇭', label: 'ไทย' },
    { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
    { code: 'tl', flag: '🇵🇭', label: 'Tagalog' },
    { code: 'id', flag: '🇮🇩', label: 'Bahasa Indonesia' },
    { code: 'ms', flag: '🇲🇾', label: 'Bahasa Melayu' },
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'it', flag: '🇮🇹', label: 'Italiano' },
    { code: 'pt', flag: '🇵🇹', label: 'Português' },
  ];

  const selectedServiceItem = services.find((service) => service.id === selectedService);
  const selectedServiceTitle =
    selectedService === 'service'
      ? ((t as Record<string, string>).facilitiesModalTitle ?? t.service)
      : selectedService === 'wifi'
        ? ((t as Record<string, string>).wifiTitle ?? t.wifi)
        : selectedService
          ? ((t as Record<string, string>)[`${selectedService}Title`] ?? (selectedServiceItem ? t[selectedServiceItem.titleKey] : ''))
          : '';

  return (
    <div className="min-h-screen bg-[#f9f2d4]">
      {/* ヘッダー */}
      <header className="bg-white/98 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-1 sm:gap-2">
            {/* 左側：ロゴとホテル名 */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 flex-1 sm:flex-none sm:max-w-none">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0">
                <Image
                  src="/icon-matome/icon-dormy.jpg"
                  alt="Dormy Hotels & Resorts"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-900 leading-tight font-bold wrap-break-word">
                  {t.hotelName}
                </p>
                <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight tracking-normal wrap-break-word">
                  {t.hotelTitle}
                </h1>
              </div>
            </div>

            {/* 中央：ナビゲーションタブ（デスクトップのみ） */}
            <nav className="hidden lg:flex items-center space-x-1 mx-auto">
              <button
                onClick={() => setActiveTab('service')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'service'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t.serviceTab}
              </button>
              <button
                onClick={() => setActiveTab('wifi')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'wifi'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t.wifi}
              </button>
            </nav>

            {/* 右側：言語選択と飲食店クーポンボタン */}
            <div className="flex items-center shrink-0 space-x-0.5 sm:space-x-1 md:space-x-2 lg:space-x-3 flex-nowrap">
              {/* 言語選択 */}
              <div ref={languageDropdownRef} className="flex items-center space-x-0 sm:space-x-0.5 md:space-x-1 relative flex-nowrap shrink-0">
                {/* Another Language ボタン */}
                <button
                  onClick={() => setShowOtherLanguages(!showOtherLanguages)}
                  className={`flex flex-col items-center p-0.5 sm:p-1 md:p-1.5 rounded transition-colors ${
                    showOtherLanguages
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  title="Other Languages"
                >
                  <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-base sm:text-lg md:text-2xl leading-none">🌐</span>
                  <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-700 leading-tight mt-0.5">Another</span>
                </button>

                {/* 他の言語ドロップダウン */}
                {showOtherLanguages && (
                  <div 
                    className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50 max-h-[60vh] sm:max-h-[300px] overflow-y-auto w-[calc(100vw-1rem)] sm:w-auto max-w-[calc(100vw-1rem)] sm:max-w-none"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {otherLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang.code as LanguageCode);
                            setShowOtherLanguages(false);
                          }}
                          className={`flex flex-col items-center p-1.5 sm:p-2 rounded transition-colors ${
                            selectedLanguage === lang.code
                              ? 'bg-blue-50'
                              : 'hover:bg-gray-50'
                          }`}
                          title={lang.label}
                        >
                          <span className="text-base sm:text-lg md:text-2xl leading-none mb-1">{lang.flag}</span>
                          <span className="text-[10px] sm:text-xs text-gray-700 leading-tight text-center">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 基本4言語 */}
                {mainLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code as LanguageCode);
                      setShowOtherLanguages(false);
                    }}
                    className={`flex flex-col items-center p-0.5 sm:p-1 md:p-1.5 rounded transition-colors ${
                      selectedLanguage === lang.code
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                    title={lang.label}
                  >
                    <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-base sm:text-lg md:text-2xl leading-none">{lang.flag}</span>
                    <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-700 leading-tight mt-0.5">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative bg-gray-900">
        <div className="relative h-96 sm:h-[500px] overflow-hidden">
          {heroImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={src}
                alt="HOTEL ドーミーイン Dormy inn"
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
                unoptimized
              />
            </div>
          ))}
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="text-center p-8 sm:p-12">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl">
                {t.heroTitle}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* ウェルカムメッセージ（飲食店クーポンボタン＋文言） */}
      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Link
              href="/coupon"
              className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-colors whitespace-nowrap shadow-md inline-block"
            >
              {t.restaurantCoupon}
            </Link>
          </div>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {t.welcomeMessage}
            <br className="hidden sm:block" />
            {t.welcomeMessage2}
          </p>
        </div>
      </section>

      {/* サービスグリッド */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={servicesGridRef} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {services.map((service, index) => (
              service.id === 'dinner' ? (
                <Link
                  key={service.id}
                  data-service-id={service.id}
                  href="/coupon"
                  className={`col-span-2 sm:col-span-3 relative overflow-hidden rounded-xl border border-gray-200 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] shadow-lg hover:shadow-xl transition-all duration-700 ease-out ${
                    visibleServices.has(service.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: visibleServices.has(service.id) ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {/* 3分割の料理画像バックグラウンド */}
                  <div className="absolute inset-0 grid grid-cols-3">
                    <div className="relative border-r border-white/30">
                      <Image
                        src={encodeURI('/coupon-site/スクリーンショット 2026-02-01 22.43.06.png')}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="33vw"
                        unoptimized
                      />
                    </div>
                    <div className="relative border-r border-white/30">
                      <Image
                        src={encodeURI('/coupon-site/スクリーンショット 2026-02-01 22.43.17.png')}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="33vw"
                        unoptimized
                      />
                    </div>
                    <div className="relative">
                      <Image
                        src={encodeURI('/coupon-site/スクリーンショット 2026-02-01 22.43.31.png')}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="33vw"
                        unoptimized
                      />
                    </div>
                  </div>
                  {/* 暗いオーバーレイ＋中央テキスト */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-white font-bold text-sm sm:text-base md:text-lg drop-shadow-md">
                      {(t as Record<string, string>).dinnerCatchphrase ?? t.dinner}
                    </span>
                    <span className="text-white font-bold text-base sm:text-lg md:text-xl mt-1 drop-shadow-md">
                      {(t as Record<string, string>).dinnerCouponLabel ?? t.dinner}
                    </span>
                  </div>
                </Link>
              ) : service.id === 'quickCheckin' ? (
                <a
                  key={service.id}
                  data-service-id={service.id}
                  href="https://dormy-hotels.com/information/k-checkin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-700 ease-out flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] md:min-h-[140px] ${
                    visibleServices.has(service.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: visibleServices.has(service.id) ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="mb-0 flex justify-center items-center shrink-0">
                    {service.icon}
                  </div>
                  <div className="-mt-5 sm:-mt-6 text-xs sm:text-sm font-semibold text-center leading-tight text-blue-800 wrap-break-word px-1">
                    {t[service.titleKey]}
                  </div>
                </a>
              ) : service.id === 'lighting' ? (
                <button
                  key={service.id}
                  data-service-id={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-700 ease-out flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] md:min-h-[140px] ${
                    visibleServices.has(service.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: visibleServices.has(service.id) ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="mb-3 sm:mb-4 flex justify-center items-center shrink-0">
                    {service.icon}
                  </div>
                  <div className={`text-xs sm:text-sm font-semibold text-center leading-tight wrap-break-word px-1 ${service.textColor || 'text-blue-800'}`}>
                    {t[service.titleKey]}
                  </div>
                </button>
              ) : service.id === 'bath' ? (
                <button
                  key={service.id}
                  data-service-id={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-700 ease-out flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] md:min-h-[140px] ${
                    visibleServices.has(service.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: visibleServices.has(service.id) ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="mb-3 sm:mb-4 flex justify-center items-center shrink-0">
                    {service.icon}
                  </div>
                  <div className={`text-xs sm:text-sm font-semibold text-center leading-tight wrap-break-word px-1 ${service.textColor || 'text-blue-800'}`}>
                    {t[service.titleKey]}
                  </div>
                </button>
              ) : (
                <button
                  key={service.id}
                  data-service-id={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-700 ease-out flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] md:min-h-[140px] ${
                    visibleServices.has(service.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: visibleServices.has(service.id) ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="mb-3 sm:mb-4 flex justify-center items-center shrink-0">
                    {service.icon}
                  </div>
                  <div className={`text-xs sm:text-sm font-semibold text-center leading-tight wrap-break-word px-1 ${service.textColor || 'text-blue-800'}`}>
                    {t[service.titleKey]}
                  </div>
                </button>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ウェルカムメッセージ */}
      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {t.welcomeMessage}
            <br className="hidden sm:block" />
            {t.welcomeMessage2}
          </p>
        </div>
      </section>

      {/* モーダルダイアログ */}
      {selectedService && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedServiceTitle}</h3>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label={t.close}
              >
                <span className="text-2xl leading-none" aria-hidden="true">×</span>
                <span>戻る</span>
              </button>
            </div>
            <div className="overflow-y-auto p-4 sm:p-6">
            {selectedService === 'checkin' && (
              <>
                <div className="space-y-3 mb-4">
                  <div className="text-sm sm:text-base text-gray-700">
                    <span className="font-semibold">{t.checkIn}</span> 15:00
                  </div>
                  <div className="text-sm sm:text-base text-gray-700">
                    <span className="font-semibold">{t.checkOut}</span> 11:00
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t.planNote}
                </p>
              </>
            )}
            {selectedService === 'bath' && (
              <>
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-gray-700 mb-2">
                    {t.bathDescription}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-gray-700">
                      <span className="font-semibold">{t.operatingHours}</span> {t.bathHours}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t.saunaNote}
                    </div>
                  </div>
                </div>
                
                {/* 大浴場の画像 */}
                <div className="mb-4 rounded-lg overflow-hidden">
                  <div className="relative w-full h-64">
            <Image
                      src="/hotel-bath.png"
                      alt={t.bathTitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 672px"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.notice}</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>{t.bathNotice1}</li>
                      <li>{t.bathNotice2}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.freeService}</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      {t.bathServiceDesc}
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>★{selectedLanguage === 'ja' ? '乳酸菌飲料' : selectedLanguage === 'en' ? 'Lactic acid drink' : selectedLanguage === 'zh' ? '乳酸菌饮料' : '유산균 음료'}/5:00~10:00</li>
                      <li>★{selectedLanguage === 'ja' ? 'アイスキャンディー' : selectedLanguage === 'en' ? 'Ice candy' : selectedLanguage === 'zh' ? '冰棒' : '아이스 캔디'}/15:00~翌1:00</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
            {selectedService === 'breakfast' && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {t.breakfastTitle}
                </h3>
                
                {/* 朝食セクション */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{t.breakfastPrice}</h4>
                  <div className="space-y-2 mb-4">
                    <div className="text-gray-700">
                      <span className="font-semibold">{t.operatingHours}</span> {t.breakfastHours}
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>{t.breakfastNote1}</li>
                      <li>{t.breakfastNote2}</li>
                    </ul>
                  </div>
                  {/* 朝食の画像 */}
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <div className="relative w-full h-64">
                      <Image
                        src="/mornig.png"
                        alt={selectedLanguage === 'ja' ? '朝食' : selectedLanguage === 'en' ? 'Breakfast' : selectedLanguage === 'zh' ? '早餐' : selectedLanguage === 'ko' ? '조식' : 'Breakfast'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 672px"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>

                {/* 夜鳴きそばセクション */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{t.sobaTitle}</h4>
                  <div className="space-y-2 mb-4">
                    <div className="text-gray-700">
                      <span className="font-semibold">{t.operatingHours}</span> {t.sobaHours}
                    </div>
                    <p className="text-sm text-gray-600">
                      {t.sobaNote}
                    </p>
                  </div>
                  {/* 夜鳴きそばの画像 */}
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <div className="relative w-full h-64">
                      <Image
                        src="/night-food.png"
                        alt={selectedLanguage === 'ja' ? '夜鳴きそば' : selectedLanguage === 'en' ? 'Late Night Soba' : selectedLanguage === 'zh' ? '夜鸣荞麦面' : selectedLanguage === 'ko' ? '야나키소바' : 'Late Night Soba'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 672px"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedService === 'service' && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <ul className="space-y-3 text-gray-700">
                    <li>
                      <span className="font-semibold">{t.vendingMachine}</span>: 1・5・9F
                      <span className="text-sm text-gray-600 ml-2">{t.alcoholNote}</span>
                    </li>
                    <li>
                      <span className="font-semibold">{t.microwave}</span>: 5・9F
                    </li>
                    <li>
                      <span className="font-semibold">{t.iceMaker}</span>: 5F
                    </li>
                    <li>
                      <span className="font-semibold">{t.smoking}</span>: 9F
                    </li>
                    <li>
                      <span className="font-semibold">{t.trouserPress}</span>: {t.trouserPressLocation}
                    </li>
                    <li>
                      <span className="font-semibold">{t.laundry}</span>: 9F
                      <p className="text-sm text-gray-600 mt-1 ml-4">
                        {t.laundryNote}
                      </p>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {selectedService === 'wifi' && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-4">
                    <div>
                      <span className="font-bold text-gray-900">SSID:</span>
                      <span className="font-bold text-gray-900 ml-2">DORMYINN</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-900">{t.password}</span>
                      <span className="font-bold text-gray-900">dormyinn1234</span>
                      <button
                        type="button"
                        onClick={copyWifiPassword}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        {wifiPasswordCopied ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {t.copiedToClipboard}
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            {t.copyPassword}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedService === 'lost' && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3 text-gray-700 leading-relaxed">
                    <p>
                      {t.lostText1}
                    </p>
                    <p>
                      {t.lostText2}
                    </p>
                    <p>
                      {t.lostText3}
                    </p>
                  </div>
                </div>
              </>
            )}
            {selectedService === 'lighting' && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {t.lightingDesc}
                  </p>
                  
                  {/* 図解の画像 */}
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <div className="relative w-full h-auto">
                      <Image
                        src="/key.png"
                        alt={`${t.lightingTitle} — ${t.lightingNote}`}
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  
                  <p className="rounded-lg bg-[#4E4846] px-4 py-3 text-center text-lg font-semibold leading-relaxed text-white sm:text-xl">
                    {t.lightingNote}
                  </p>
                </div>
              </>
            )}
            {selectedService === 'longstay' && (
              <>
                
                {/* シーツ交換について */}
                <div className="mb-6">
                  <div className="mb-4 rounded-lg overflow-hidden flex justify-center">
                    <div className="relative w-64 h-auto max-w-full">
                      <Image
                        src="/shirts.png"
                        alt={selectedLanguage === 'ja' ? 'シーツ交換用WECOカード' : selectedLanguage === 'en' ? 'WECO Card for Sheet Exchange' : selectedLanguage === 'zh' ? '床单更换用WECO卡' : selectedLanguage === 'ko' ? '시트 교체용 WECO 카드' : 'WECO Card for Sheet Exchange'}
                        width={400}
                        height={600}
                        className="w-full h-auto object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {t.sheetExchange}
                  </p>
                </div>

                {/* 清掃不要について */}
                <div className="mb-6">
                  <div className="mb-4 rounded-lg overflow-hidden flex justify-center">
                    <div className="relative w-64 h-auto max-w-full">
                      <Image
                        src="/room-clean.png"
                        alt={selectedLanguage === 'ja' ? '清掃不要用WECOカード' : selectedLanguage === 'en' ? 'WECO Card for No Cleaning' : selectedLanguage === 'zh' ? '不需要清洁用WECO卡' : selectedLanguage === 'ko' ? '청소 불필요용 WECO 카드' : 'WECO Card for No Cleaning'}
                        width={400}
                        height={600}
                        className="w-full h-auto object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {t.noCleaning}
                  </p>
                </div>
              </>
            )}
            {selectedService !== 'checkin' && selectedService !== 'bath' && selectedService !== 'breakfast' && selectedService !== 'service' && selectedService !== 'wifi' && selectedService !== 'lost' && selectedService !== 'lighting' && selectedService !== 'longstay' && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {services.find(s => s.id === selectedService) ? t[services.find(s => s.id === selectedService)!.titleKey] : ''}
                </h3>
                <p className="text-gray-700 mb-4">
                  {t.preparing}
                </p>
              </>
            )}
            </div>
          </div>
        </div>
      )}

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            {/* 左側：ホテル情報 */}
            <div className="md:col-span-2 flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {t.hotelName}<br />{t.hotelTitle}
              </h3>
              <div className="space-y-2 text-sm text-gray-700 mb-6">
                <p>〒980-0021<br />{selectedLanguage === 'ja' ? '宮城県仙台市青葉区中央2丁目11-26' : selectedLanguage === 'en' ? '2-11-26 Chuo, Aoba-ku, Sendai, Miyagi 980-0021' : selectedLanguage === 'zh' ? '宫城县仙台市青叶区中央2丁目11-26' : '미야기현 센다이시 아오바구 주오 2-11-26'}</p>
                <p>TEL 022-715-7333</p>
              </div>
              <div className="mt-6">
                <Link
                  href="https://dormy-hotels.com/dormyinn/hotels/sendai_ax/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-20 h-20">
                    <Image
                      src="/bird.png"
                      alt={selectedLanguage === 'ja' ? '鳥のキャラクター' : selectedLanguage === 'en' ? 'Bird Character' : selectedLanguage === 'zh' ? '鸟角色' : selectedLanguage === 'ko' ? '새 캐릭터' : 'Bird Character'}
                      fill
                      className="object-contain"
                      sizes="80px"
                      unoptimized
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{t.officialHP}</span>
                </Link>
              </div>
            </div>

            {/* 右側：Googleマップ */}
            <div className="md:col-span-3">
              <div className="w-full h-64 sm:h-80 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent('宮城県仙台市青葉区中央2丁目11-26 ドーミーイン仙台ANNEX')}&output=embed&hl=ja&z=17`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="天然温泉 青葉の湯 ドーミーイン仙台ANNEX"
                ></iframe>
              </div>
            </div>
          </div>

          {/* コピーライト */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-xs text-gray-500">
              © kyoritsugroup.co.jp All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
