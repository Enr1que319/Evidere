from csv import DictReader
from random import choice
from itertools import groupby
from operator import itemgetter

# Funcion para leer los archivos csv
def open_csv(csv_file):
    with open(csv_file) as c:  
        csv_data = [row for row in DictReader(c)]
        
    return csv_data

# Funcion que regresa una propuesta de cada candidato en forma aleatoria
def get_prop(category):
    prop_data = open_csv(f'data/prop_{category}.csv')
    prop_data.sort(key=itemgetter('id_presidente'))
    cand_groups = groupby(prop_data, key=itemgetter('id_presidente'))
    choices_qz = [(int(id_presidente), choice(list(propuestas))['Propuesta']) for id_presidente, propuestas in cand_groups]

    return choices_qz
    

if __name__ == '__main__':
    try:
        print(get_prop('salud'))
    except ValueError:
        print("The schema is not correct, please check the csv file")
