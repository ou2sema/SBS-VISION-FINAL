import { InternalProduct } from '../../types';

const now = '2026-09-19T00:00:00.000Z';

function sscProduct(
  id: string,
  model: string,
  name: string,
  category: string,
  price: number,
  subcategory: string
): InternalProduct {
  return {
    id: `ssc-${id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    brand: 'SSC',
    model,
    category,
    subcategory,
    technicalSpecifications: { Source: 'SSC.TN - catalogue import' },
    source: 'https://ssc.tn/shop',
    sourceProductId: id,
    internalPurchasePrice: price,
    internalSellingPrice: Math.ceil(price * 1.3 * 1000) / 1000,
    availability: 'IN_STOCK',
    stockStatus: 'À confirmer',
    active: true,
    lifecycleStatus: 'ACTIVE',
    serviceTags: [category],
    searchKeywords: [name.toLowerCase(), model.toLowerCase(), 'ssc'],
    createdAt: now,
    updatedAt: now,
  };
}

// Initial references collected from SSC.TN shop pages 1 to 5.
const SSC_BASE_PRODUCTS: InternalProduct[] = [
  sscProduct('RJ45', 'RJ45', 'Connecteur RJ45 UTP CAT5', 'networking', 0.275, 'Connectique réseau'),
  sscProduct('WT-1049B', 'WT-1049B', "Connecteurs d'étanchéité W&T", 'networking', 0.357, 'Accessoires réseau'),
  sscProduct('CON_FTP6', 'CON_FTP6', 'Connecteur RJ45 FTP CAT6', 'networking', 0.55, 'Connectique réseau'),
  sscProduct('1M-RESEAUX', '1M-RESEAUX', 'Câble réseaux UTP CAT6 (1 m)', 'networking', 0.746, 'Câblage réseau'),
  sscProduct('FTP6', 'FTP6', 'Câble réseaux FTP CAT6 (1 m)', 'networking', 0.916, 'Câblage réseau'),
  sscProduct('XL600', 'XL600', 'Câble réseaux UTP CAT6 ZKT', 'networking', 1, 'Câblage réseau'),
  sscProduct('BOIT', 'BOIT', 'Boîte de jonction caméra', 'cctv', 1.702, 'Accessoires vidéosurveillance'),
  sscProduct('SUPPORT-L', 'SUPPORT-L', 'Support caméra dôme', 'cctv', 7.854, 'Supports caméra'),
  sscProduct('CHARGEUR-12V-1A', 'CHARGEUR-12V-1A', 'Chargeur 12V 1A', 'networking', 8.509, 'Alimentation'),
  sscProduct('HDMI-4K', 'HDMI-4K', 'Câble HDMI 3 m 4K', 'networking', 19.635, 'Câbles vidéo'),
  sscProduct('POWER_5A', 'POWER_5A', 'Bloc alimentation 12V 5A', 'networking', 22.004, 'Alimentation'),
  sscProduct('DH-PFM320D-EN', 'DH-PFM320D-EN', 'Chargeur Dahua 12V 2A original', 'networking', 25.63, 'Alimentation'),
  sscProduct('DH-SF1005L', 'DH-SF1005L', 'Switch 5 ports Dahua 10/100 Mbps', 'networking', 28.798, 'Switchs réseau'),
  sscProduct('PG-403R', 'PG-403R', 'Télécommande alarme FOCUS B 433 MHz', 'alarm', 30.107, 'Accessoires alarme'),
  sscProduct('CTI016', 'CTI016', 'Contact magnétique plastique encastré', 'alarm', 11.9, 'Détection intrusion'),
  sscProduct('CR123A', 'CR123A', 'Pile FOCUS 3V CR123A', 'alarm', 12.317, 'Alimentation alarme'),
  sscProduct('076565', '076565', 'Connecteur RJ45 Legrand FTP CAT6', 'networking', 25.46, 'Connectique réseau'),
  sscProduct('BOUT', 'BOUT', 'Bouton EXIT inox apparent', 'access_control', 28.56, "Contrôle d'accès"),
];

const SSC_IMAGE_URLS: Record<string, string> = {
  RJ45: 'https://ssc.tn/web/image/product.template/2723/image_512/%5BRJ45%5D%20CONNECTEUR%20RJ45%20UTP%20CAT5?unique=1fca76e',
  'WT-1049B': "https://ssc.tn/web/image/product.template/4534/image_512/%5BWT-1049B%5D%20CONNECTEURS%20D'ETANCHEITE?unique=1683d3b",
  CON_FTP6: 'https://ssc.tn/web/image/product.template/2722/image_512/%5BCON_FTP6%5D%20CONNECTEUR%20RJ45%20FTP%20CAT6?unique=e888f21',
  '1M-RESEAUX': 'https://ssc.tn/web/image/product.template/2469/image_512/%5B1M-RESEAUX%5D%20%201M%20CABLE%20RESEAUX%20UTP%20CAT6?unique=a758704',
  FTP6: 'https://ssc.tn/web/image/product.template/4943/image_512/%5BFTP6%5D%20%201M%20CABLE%20RESEAUX%20FTP%20CAT6?unique=430cb31',
  XL600: 'https://ssc.tn/web/image/product.template/3888/image_512/%5BXL600%5D%20CABLE%20RESEAUX%20UTP%20CAT6%20ZKT?unique=a621bb7',
  BOIT: 'https://ssc.tn/web/image/product.template/2578/image_512/%5BBOIT%5D%20BOITE%20JANCTION%20CAMERA%20?unique=80e0522',
  'SUPPORT-L': 'https://ssc.tn/web/image/product.template/3639/image_512/%5BSUPPORT-L%5D%20SUPPORT%20CAMERA%20DOME?unique=acc8220',
  'CHARGEUR-12V-1A': 'https://ssc.tn/web/image/product.template/3144/image_512/CHARGEUR%2012V%201A?unique=f698ccf',
  'HDMI-4K': 'https://ssc.tn/web/image/product.template/2596/image_512/%5BHDMI-4K%5D%20CABLE%20HDMI%203M%204k?unique=7eede55',
  POWER_5A: 'https://ssc.tn/web/image/product.template/2550/image_512/%5BPOWER_5A%5D%20BLOC%20ALIMENTATION%2012V%205A?unique=292a6bb',
  'DH-PFM320D-EN': 'https://ssc.tn/web/image/product.template/2714/image_512/%5BDH-PFM320D-EN%5D%20CHARGEUR%20DAHUA%2012V%202A%20ORIGINAL?unique=1ea7990',
  'DH-SF1005L': 'https://ssc.tn/web/image/product.template/4827/image_512/%5BDH-SF1005L%5D%20SWITCH%205%20PORT%20DAHUA%2010-100Mbps%20?unique=4c773f5',
  'PG-403R': 'https://ssc.tn/web/image/product.template/2832/image_512/%5BPG-403R%5D%20TELECOMMANDE%20ALARM%20FOCUSB%20433MHZ?unique=a939af7',
  CTI016: 'https://ssc.tn/web/image/product.template/2728/image_512/%5BCTI016%5D%20CONTACT%20MANGNETIQUE%20PLASTIQUE%20ENCASTREE?unique=9ec91d3',
  CR123A: 'https://ssc.tn/web/image/product.template/2898/image_512/%5BCR123A%5D%20PILE%20FOCUS%203V%20CR123A?unique=a1987a1',
  '076565': 'https://ssc.tn/web/image/product.template/3825/image_512/%5B076565%5D%20NOYOU%20RJ45%20LEGRAND%20FTP%20CAT6?unique=4bfc816',
  BOUT: 'https://ssc.tn/web/image/product.template/2582/image_512/%5BBOUT%5D%20BOUTON%20EXIT%20INOX%20APPARENT%20?unique=05981b6',
};

export const SSC_INITIAL_PRODUCTS: InternalProduct[] = SSC_BASE_PRODUCTS.map((product) => ({
  ...product,
  images: SSC_IMAGE_URLS[product.sourceProductId || '']
    ? [SSC_IMAGE_URLS[product.sourceProductId || '']]
    : undefined,
}));
