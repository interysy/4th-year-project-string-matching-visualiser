import numpy as np
import matplotlib.pyplot as plt


labels_legend = ['Ease of Use Desktop A', 'Ease of Use Desktop B', 'Intuitiveness Desktop A', 'Intuitiveness Desktop B', 'Ease Of Use Mobile A+B Combined']
categories = ["Q6 A" , "Q6 B", "Q8 A" , "Q8 B", "Q11 A+B"]
averages = [4.667, 4.111, 4.667, 4.556, 4.524]
std_devs = [0.492, 0.500, 0.492, 0.726, 0.814]
colors = ['blue', 'red', 'yellow', 'purple', 'orange']


category_positions = np.arange(len(categories))
bars = plt.bar(category_positions, averages, yerr=std_devs, align='center', alpha=0.5, color=colors)
plt.ylim(0, 5)
plt.ylabel('Average Rating Out Of 5 (3 s.f.)')
plt.title('Average Usability Ratings For StrVis')
plt.xticks(category_positions, categories, rotation=45)
legend = plt.legend(bars, labels_legend, bbox_to_anchor=(1, 0.5))
plt.savefig('output.svg', format='svg', bbox_extra_artists=(legend,))
plt.tight_layout()
plt.show()


