export interface BoliviaDivision {
  department: string;
  provinces: {
    name: string;
    municipalities: string[];
  }[];
}

export const boliviaDivisions: BoliviaDivision[] = [
  {
    department: 'Chuquisaca',
    provinces: [
      {
        name: 'Oropeza',
        municipalities: ['Sucre', 'Yotala', 'Poroma', 'Tarabuco']
      },
      {
        name: 'Azurduy',
        municipalities: ['Azurduy', 'Tarvita', 'Sanagasta']
      },
      {
        name: 'Zudáñez',
        municipalities: ['Zudáñez', 'Presto', 'Mojocoya', 'Icla']
      }
    ]
  },
  {
    department: 'La Paz',
    provinces: [
      {
        name: 'Ingavi',
        municipalities: ['Viacha', 'Guaqui', 'Tiahuanacu', 'Desaguadero']
      },
      {
        name: 'Murillo',
        municipalities: ['La Paz', 'Palca', 'Mecapaca', 'Achocalla']
      },
      {
        name: 'Los Andes',
        municipalities: ['Pucarani', 'Laja', 'Batallas', 'Puerto Pérez']
      }
    ]
  },
  {
    department: 'Cochabamba',
    provinces: [
      {
        name: 'Quillacollo',
        municipalities: ['Quillacollo', 'Sipe Sipe', 'Tiquipaya', 'Vinto', 'Colcapirhua']
      },
      {
        name: 'Cercado',
        municipalities: ['Cochabamba', 'Sacaba', 'Colomi', 'Villa Tunari']
      },
      {
        name: 'Chapare',
        municipalities: ['Sacaba', 'Colomi', 'Villa Tunari', 'Puerto Villarroel']
      }
    ]
  },
  {
    department: 'Oruro',
    provinces: [
      {
        name: 'Pantaleón Dalence',
        municipalities: ['Huanuni', 'Machacamarca', 'El Choro']
      },
      {
        name: 'Cercado',
        municipalities: ['Oruro', 'Caracollo', 'Paria', 'Soracachi']
      },
      {
        name: 'Poopó',
        municipalities: ['Poopó', 'Antequera', 'Pazña', 'Venta y Media']
      }
    ]
  },
  {
    department: 'Potosí',
    provinces: [
      {
        name: 'Antonio Quijarro',
        municipalities: ['Uyuni', 'Tomave', 'Porco', 'Tupiza']
      },
      {
        name: 'Tomas Frías',
        municipalities: ['Potosí', 'Tinguipaya', 'Yocalla', 'Urmiri']
      },
      {
        name: 'Nor Chichas',
        municipalities: ['Cotagaita', 'Vitichi', 'Soco', 'Caiza D']
      }
    ]
  },
  {
    department: 'Tarija',
    provinces: [
      {
        name: 'Aniceto Arce',
        municipalities: ['Padcaya', 'Bermejo', 'Yacuiba']
      },
      {
        name: 'Cercado',
        municipalities: ['Tarija', 'San Lorenzo', 'El Puente', 'Uriondo']
      },
      {
        name: 'Gran Chaco',
        municipalities: ['Villamontes', 'Caraparí', 'Yacuiba']
      }
    ]
  },
  {
    department: 'Santa Cruz',
    provinces: [
      {
        name: 'Obispo Santistevan',
        municipalities: ['Montero', 'General Saavedra', 'Mineros', 'Fernández Alonso']
      },
      {
        name: 'Andrés Ibáñez',
        municipalities: ['Santa Cruz de la Sierra', 'Cotoca', 'Porongo', 'La Guardia']
      },
      {
        name: 'Warnes',
        municipalities: ['Warnes', 'Okinawa Uno', 'Colpa Bélgica']
      }
    ]
  },
  {
    department: 'Beni',
    provinces: [
      {
        name: 'Cercado',
        municipalities: ['Trinidad', 'San Javier', 'San Pedro de Moxos']
      },
      {
        name: 'Vaca Díez',
        municipalities: ['Riberalta', 'Guayaramerín', 'Puerto Rico']
      },
      {
        name: 'José Ballivián',
        municipalities: ['Reyes', 'San Borja', 'Santa Rosa', 'Rurrenabaque']
      }
    ]
  },
  {
    department: 'Pando',
    provinces: [
      {
        name: 'Nicolás Suárez',
        municipalities: ['Cobija', 'Porvenir', 'Filadelfia', 'Bella Flor']
      },
      {
        name: 'Manuripi',
        municipalities: ['Puerto Rico', 'San Pedro', 'El Sena']
      },
      {
        name: 'Madre de Dios',
        municipalities: ['Puerto Gonzalo Moreno', 'San Lorenzo', 'Sena']
      }
    ]
  }
]; 