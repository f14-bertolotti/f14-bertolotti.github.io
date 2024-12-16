import matplotlib.pyplot as plt
import numpy as np

#data = open("rossler.txt", "r").read().split("\n")
#data = np.array([[float(n) for n in x.split(" ") if n] for x in data if x]).view(10000,10000,3)
data = np.loadtxt("rossler.txt").reshape((20,10000,3))[:,500:,:].reshape((-1,3))
print(data.shape)

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.set_xlim(-20, 20)
ax.set_ylim(-20, 20)
ax.set_zlim(-20, 20)
ax.scatter(data[:,0], data[:,1], data[:,2], s=1)
plt.show()


