const { Client, ClientBase } = require('pg');

const argumentos = process.argv.slice(2)

const config = {
  user: 'joseorellanaaravena',
  host: 'localhost',
  database: 'escuela',
  password: '240512',
  port: 5432,
}

const client = new Client(config);

client.connect()

if (argumentos[0] === 'nuevo') {
  conexion()
    .then(() => nuevo())
} else if (argumentos[0] === 'consulta') {
  conexion()
    .then(() => consulta())
} else if (argumentos[0] === 'editar') {
  conexion()
    .then(() => editar())
} else if (argumentos[0] === 'eliminar') {
  conexion()
    .then(() => eliminar())
}

async function conexion() {
  client.query('SELECT NOW()', (err, data) => {
    if (err) {
      console.log('Error de conexión: ', err)
    }
    if (data) {
      console.log('Conexión exitosa a la BD: ', data.rows[0].now)
    }
  })
}

async function nuevo() {
  const _nombre = argumentos[1]
  const _rut = argumentos[2]
  const _curso = argumentos[3]
  const _nivel = parseInt(argumentos[4])
  client.query(`
    INSERT INTO estudiantes (nombre, rut, curso, nivel)
    VALUES ('${_nombre}', '${_rut}', '${_curso}', ${_nivel})
    RETURNING *`, (err, data) => {
      if (err) {
        console.log('El error es:\n', err);
        client.end();
      }
      if (data) {
        console.log(`Estudiante "${data.rows[0].nombre.toUpperCase()}" agrgado con éxito`);
        client.end();
      }
    }
  );
}

async function consulta() {
  if (argumentos.length == 1) {
    const res = await client.query('SELECT * FROM estudiantes')
    console.log('Registros totales de la base:\n', res.rows);
    client.end()
  } else if (argumentos.length == 2) {
    const res = await client.query(`SELECT * FROM estudiantes WHERE rut = '${argumentos[1]}'`)
    console.log('Los datos del rut consultado son:\n', res.rows);
    client.end()    
  } else {
    console.log('Error: Revisar argumentos de la línea de comandos...')
    client.end()    
  }
}

async function editar() {
  const _nombre = argumentos[1]
  const _rut = argumentos[2]
  const _curso = argumentos[3]
  const _nivel = parseInt(argumentos[4])
  client.query(`
    UPDATE estudiantes
    SET
      nombre = '${_nombre}',
      curso = '${_curso}',
      nivel = ${_nivel}
    WHERE rut = '${_rut}'
    RETURNING *`, (err, data) => {
      if (err) {
        console.log('El error es:\n', err);
        client.end();
      }
      if (data) {
        console.log(`Estudiante "${data.rows[0].nombre.toUpperCase()}" editado con éxito`);
        client.end();
      }
    }
  );
}

async function eliminar() {
  client.query(`
    DELETE FROM estudiantes WHERE rut = '${argumentos[1]}'`, (err, data) => {
      if (err) {
        console.log('El error es:\n', err);
        client.end();
      }
      if (data) {
        console.log(`Registro de estuduante con rut "${argumentos[1]}" eliminado con éxito`);
        client.end();
      }
    }
  );
}