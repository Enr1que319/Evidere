import pandas as pd
import json

def open_json(file):
    with open(file) as f:
        json_schema = json.load(f)
    
    return json_schema

def structure_csv(prop_file,prop_schema,cand_file,cand_schema):

    prop_df = pd.read_csv(prop_file,dtype=open_json(prop_schema))
    cand_df = pd.read_csv(cand_file,dtype=open_json(cand_schema))
    candidates_prop_df = pd.merge(prop_df, cand_df, on="Candidato")

    return candidates_prop_df

    #Separar en ficheros las categorias, en cada archivo propuesta y candidato


if __name__ == '__main__':
    try:
        print(structure_csv('data/propuestas_candidatos.csv','schemas/prop_schema.json','data/candidatos_presidencia.csv','schemas/cand_schema.json'))
    except ValueError:
        print("The schema is not correct, please check the csv file")
