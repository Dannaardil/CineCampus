```
boletos

{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'proyeccion_id',
      'usuario_id',
      'asientos',
      'precio_total'
    ],
    properties: {
      proyeccion_id: {
        bsonType: 'objectId'
      },
      usuario_id: {
        bsonType: 'objectId'
      },
      asientos: {
        bsonType: 'object',
        required: [
          'fila',
          'numero'
        ],
        properties: {
          fila: {
            bsonType: 'string'
          },
          numero: {
            bsonType: 'int'
          }
        }
      },
      precio_total: {
        bsonType: 'decimal'
      },
      descuento_aplicado: {
        bsonType: 'decimal'
      },
      fecha_compra: {
        bsonType: 'date'
      }
    }
  }
}
```

```
pagos 

{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'boleto_id',
      'monto',
      'metodo_pago',
      'estado'
    ],
    properties: {
      boleto_id: {
        bsonType: 'objectId'
      },
      monto: {
        bsonType: 'decimal'
      },
      metodo_pago: {
        bsonType: 'string'
      },
      estado: {
        'enum': [
          'pendiente',
          'completado',
          'cancelado'
        ]
      },
      fecha_pago: {
        bsonType: 'date'
      }
    }
  }
}
```

```
peliculas 

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
      'fechaRetiro'
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
      }
    }
  }
}
```

```
proyecciones

{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'pelicula_id',
      'sala_id',
      'inicio',
      'fin',
      'precio'
    ],
    properties: {
      pelicula_id: {
        bsonType: 'objectId'
      },
      sala_id: {
        bsonType: 'objectId'
      },
      Inicio: {
        bsonType: 'date'
      },
      Fin: {
        bsonType: 'date'
      },
      precio: {
        bsonType: 'decimal'
      },
      formato: {
        bsonType: 'string'
      }
    }
  }
}
```

```
salas

{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'numero',
      'capacidad'
    ],
    properties: {
      numero: {
        bsonType: 'int'
      },
      capacidad: {
        bsonType: 'int'
      },
      tipo: {
        bsonType: 'string'
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
            }
          }
        }
      }
    }
  }
}
```

```
usuario


{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'nombre',
      'email',
      'rol'
    ],
    properties: {
      nombre: {
        bsonType: 'string'
      },
      email: {
        bsonType: 'string'
      },
      rol: {
        'enum': [
          'estandar',
          'vip',
          'administrador'
        ]
      },
      tarjeta_vip: {
        bsonType: 'object',
        properties: {
          numero: {
            bsonType: 'string'
          },
          fecha_expiracion: {
            bsonType: 'string'
          }
        }
      }
    }
  }
}
```

