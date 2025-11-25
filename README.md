# isabelle-d.github.io

<b>Introduction: </b> 
The SpendWise app's purpose is to create an easy way for users to manage budgets and expenses,  interact with a custom chatbot, and collaborate through shared savings groups. There are main pages: Dashboard, which has a visual representation of a user's budgets and expenses, Expenses, Budgets, Savings Circles, and the ChatBot. Expenses and Budgets work together seamlessly, with any change to Expenses being reflected in Budget and vice versa. Users can also collaborate with other users through Savings Circle groups that have invite functionality and shared contributions to an Expense. Lastly, the Chatbot uses an Ollama Java API to communicate with the user with a consistent UI. It can use the information stored in Firebase to suggest actions to the user, such as help them cut costs in certain categories. 

<b>Design & Architecture: </b> 
As an Android App our project uses MVVM architecture, seperating data into ViewModels and UI into View Classes. This makes managing the code much easier and improves future scalability. Furthermore, our team implemented various patterns, including Factory, Strategy, Observer, and Decorator. The Factory and Strategy patterns centralized and managed budget and expense periods across the entire app while keeping them easy to edit. The decorator pattern helped manage how chatbot messages would be shown on the user side. And finally, the observer helped with updating the Budget UI when a budget was edited. 

During the development of the project, we used various Agile framework development processes, including use case diagrams, design class diagrams, and sequence diagrams. Below is SpendWise's design class diagram. 


<b>User Interface (UI):  </b> 
Showcase a guided visual tour of the application using annotated
screenshots. Highlight key screens such as Dashboard, Expense Log, Budgets, Savings
Circles, and the AI Chatbot. Explain how your team approached UI/UX consistency,
theming, and user navigation.
<b>Functionality:</b> A video demonstrating the SpendWise app functionality is below. 
<b>Conclusions and Reflections:</b> Wrap up with a reflective overview of the project
outcomes, detailing your contributions, the challenges encountered, and the knowledge
gained throughout the development process.

<b>Contributors: </b> 
Isabelle Darling
Ethan Zhang
Alexis Andrulonis
Jayden Bastien 
Murtaza Naidir
Acknowledge all team members who contributed to the app's
development. Specifically, highlight those who were instrumental in the website's
deployment
