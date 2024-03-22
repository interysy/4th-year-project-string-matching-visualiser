import numpy as np
import matplotlib.pyplot as plt

labels_legend = ['Overall Learning Effectiveness', 'Usefulness Of Brute Force On Website For Learning', 'Usefulness Of Boyer Moore On Website For Learning', 'Usefulness Of Knuth-Morris-Pratt On Website For Learning', 'Usefulness Of Complex Border Table Generation For Learning On Website']
categories = ["Q12" , "Q14", "Q15" , "Q16",  "Q17"]
averages = [4.571, 5, 4.571, 4.381, 4.14]
std_devs = [0.507, 0, 0.746, 0.805, 0.793]
colors = ['red', 'blue', 'yellow', 'purple', 'orange']

category_positions = np.arange(len(categories))
bars = plt.bar(category_positions, averages, yerr=std_devs, align='center', alpha=0.5, color=colors)
plt.ylim(0, 5)
plt.ylabel('Average Rating Out Of 5 (3 s.f.)')
plt.title('Average Learning Easiness Ratings For StrVis')
plt.xticks(category_positions, categories, rotation=45)
legend = plt.legend(bars, labels_legend, loc='center left', bbox_to_anchor=(1, 0.5))
plt.subplots_adjust(right=0.5)
plt.gcf().set_size_inches(15, 6)
plt.savefig('output2.svg', format='svg', bbox_extra_artists=(legend,))
plt.tight_layout()
plt.show()
