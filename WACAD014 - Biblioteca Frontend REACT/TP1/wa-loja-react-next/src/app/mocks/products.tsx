import { Product } from '../types/product'

export const mockProducts: Product[] = [
  {
    id: 'notebook-3',
    images: [
      {
        name: 'notebook-4',
        src: 'https://ranekapi.origamid.dev/wp-content/uploads/2019/03/notebook-2.jpg'
      },
      {
        name: 'smartwatch-3',
        src: 'https://ranekapi.origamid.dev/wp-content/uploads/2019/03/smartwatch-2.jpg'
      }
    ],
    name: 'Notebook',
    price: '2300',
    rebate: 15,
    description: 'descrição legal',
    sold: 'false',
    user_id: 'lobo@origamid.com'
  },
  {
    id: 'smartphone-2',
    images: [
      {
        name: 'smartphone-3',
        src: 'https://ranekapi.origamid.dev/wp-content/uploads/2019/03/smartphone-2.jpg'
      },
      {
        name: 'tablet-3',
        src: 'https://ranekapi.origamid.dev/wp-content/uploads/2019/03/tablet-2.jpg'
      }
    ],
    name: 'Smartphone',
    price: '2399',
    rebate: 8,
    description: 'descrição legal',
    sold: 'false',
    user_id: 'lobo@origamid.com'
  },
  {
    id: 'camera',
    images: [
      {
        name: 'camera-2',
        src: 'https://ranekapi.origamid.dev/wp-content/uploads/2019/03/camera.jpg'
      }
    ],
    name: 'Câmera',
    price: '2199',
    rebate: 10,
    description: 'descrição legal',
    sold: 'false',
    user_id: 'lobo@origamid.com'
  },
  {
    id: 'smartwatch',
    images: [
      {
        name: 'smartwatch-2',
        src: 'https://ranekapi.origamid.dev/wp-content/uploads/2019/03/smartwatch-1.jpg'
      }
    ],
    name: 'Smartwatch',
    price: '1199',
    rebate: 8,
    description: 'descrição legal',
    sold: 'false',
    user_id: 'lobo@origamid.com'
  },
  {
    id: 'smartspeaker',
    images: [
      {
        name: 'speaker',
        src: 'https://ranekapi.origamid.dev/wp-content/uploads/2019/03/speaker.jpg'
      },
      {
        name: 'tablet',
        src: 'https://ranekapi.origamid.dev/wp-content/uploads/2019/03/tablet.jpg'
      }
    ],
    name: 'Smartspeaker',
    price: '1499',
    rebate: 10,
    description: 'Esse é um speaker novo.',
    sold: 'false',
    user_id: 'maria@origamid.com'
  }
]