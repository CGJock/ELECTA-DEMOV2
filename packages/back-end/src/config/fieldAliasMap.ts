export const fieldAliasMap: Record<string, string> = {
  "VOTOS VÁLIDOS": "validVotes",
  "VOTOS BLANCOS": "blankVotes",
  "VOTOS NULOS": "nullVotes",
  "image_url": "image_url",
  "Imagen": "image_url",
};



export const IGNORE_KEYS = [
    'Departamento', 'Provincia', 'Municipio', 'Localidad', 'Recinto',
    'nullVotes', 'blankVotes', 'validVotes',
    'VOTOS VÁLIDOS', 'VOTOS BLANCOS', 'VOTOS NULOS',
    'project_id', 'project_name', 'date_start_time', 'date_time_complete',
    'image_url','_image_url','verification'
  ];
