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
export const SSC_INITIAL_PRODUCTS: InternalProduct[] = [
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
