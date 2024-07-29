BOLETOS:

```
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'proyeccion_id',
      'usuario_id',
      'asiento',
      'fecha_compra',
      'codigo'
    ],
    properties: {
      proyeccion_id: {
        bsonType: 'int'
      },
      usuario_id: {
        bsonType: 'int'
      },
      asiento: {
        bsonType: 'object',
        required: [
          'fila',
          'numero',
          'tipo'
        ],
        properties: {
          fila: {
            bsonType: 'string'
          },
          numero: {
            bsonType: 'int'
          },
          tipo: {
            bsonType: 'string',
            'enum': [
              'vip',
              'regular'
            ]
          }
        }
      },
      fecha_compra: {
        bsonType: 'date'
      },
      codigo: {
        bsonType: 'int'
      }
    }
  }
}
```

PAGOS: 

```
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'metodo_pago',
      'estado',
      'fecha_de_pago',
      'tipo_transaccion',
      'boleto_cod',
      'id'
    ],
    properties: {
      metodo_pago: {
        bsonType: 'string',
        'enum': [
          'tarjeta',
          'efectivo'
        ]
      },
      estado: {
        bsonType: 'string',
        'enum': [
          'completado',
          'pendiente',
          'cancelado'
        ]
      },
      fecha_pago: {
        bsonType: 'date'
      },
      tipo_transaccion: {
        bsonType: 'string'
      },
      boleto_cod: {
        bsonType: 'int'
      },
      id: {
        bsonType: 'int'
      }
    }
  }
}
```

PELICULAS

```
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'titulo',
      'genero',
      'duracion',
      'sinopsis',
      'clasificacion',
      'fechaEstreno',
      'fechaRetiro',
      'director',
      'actores',
      'id'
    ],
    properties: {
      titulo: {
        bsonType: 'string'
      },
      genero: {
        bsonType: 'string'
      },
      duracion: {
        bsonType: 'int'
      },
      sinopsis: {
        bsonType: 'string'
      },
      clasificacion: {
        bsonType: 'string'
      },
      fechaEstreno: {
        bsonType: 'date'
      },
      fechaRetiro: {
        bsonType: 'date'
      },
      director: {
        bsonType: 'string'
      },
      actores: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        }
      },
      id: {
        bsonType: 'int'
      }
    }
  }
}
```

PROYECCIONES

```
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'pelicula_id',
      'sala_id',
      'inicio',
      'fin',
      'precio',
      'formato',
      'id'
    ],
    properties: {
      pelicula_id: {
        bsonType: 'int'
      },
      sala_id: {
        bsonType: 'int'
      },
      inicio: {
        bsonType: 'date'
      },
      fin: {
        bsonType: 'date'
      },
      precio: {
        bsonType: 'int'
      },
      formato: {
        bsonType: 'string'
      },
      id: {
        bsonType: 'int'
      }
    }
  }
}
```

SALAS

```
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'numero',
      'capacidad',
      'asientos'
    ],
    properties: {
      numero: {
        bsonType: 'int'
      },
      capacidad: {
        bsonType: 'int'
      },
      asientos: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: [
            'fila',
            'numero',
            'tipo'
          ],
          properties: {
            fila: {
              bsonType: 'string'
            },
            numero: {
              bsonType: 'int'
            },
            tipo: {
              bsonType: 'string',
              'enum': [
                'regular',
                'vip'
              ]
            }
          }
        }
      }
    }
  }
}
```

USUARIOS

```
{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'nombre',
      'email',
      'rol',
      'id'
    ],
    properties: {
      nombre: {
        bsonType: 'string'
      },
      email: {
        bsonType: 'string'
      },
      rol: {
        bsonType: 'string',
        'enum': [
          'estandar',
          'vip',
          'administrador'
        ]
      },
      id: {
        bsonType: 'int'
      },
      tarjeta_vip: {
        bsonType: 'object',
        required: [
          'estado',
          'numero'
        ],
        properties: {
          estado: {
            bsonType: 'string'
          },
          numero: {
            bsonType: 'string'
          }
        }
      }
    }
  }
}
```

