# isabelle-d.github.io

<b>Introduction: </b> 
The SpendWise app's purpose is to create an easy way for users to manage budgets and expenses,  interact with a custom chatbot, and collaborate through shared savings groups. There are main pages: Dashboard, which has a visual representation of a user's budgets and expenses, Expenses, Budgets, Savings Circles, and the ChatBot. Expenses and Budgets work together seamlessly, with any change to Expenses being reflected in Budget and vice versa. Users can also collaborate with other users through Savings Circle groups that have invite functionality and shared contributions to an Expense. Lastly, the Chatbot uses an Ollama Java API to communicate with the user with a consistent UI. It can use the information stored in Firebase to suggest actions to the user, such as help them cut costs in certain categories. Our team did our best to make the UI easy to use and straightforward. This app was made so that anyone can use it to manage their finances without being worried about complex organization and a hard-to-understand UI. 

<b>Design & Architecture: </b> 
As an Android App our project uses MVVM architecture, separating data into ViewModels and UI into View Classes. MVVM is the standard architecture of Android Apps and during my time working on SpendWise I had the opportunity to learn about how and why MVVM is implemented. This architecture makes managing the code much easier and improves future scalability. Furthermore, our team implemented various patterns, including Factory, Strategy, Observer, and Decorator. The Factory and Strategy patterns centralized and managed budget and expense periods across the entire app while keeping them easy to edit. The decorator pattern helped manage how chatbot messages would be shown on the user side. And finally, the observer helped with updating the Budget UI when a budget was edited. 

During the development of the project, we used various Agile framework development processes, including use case diagrams, design class diagrams, and sequence diagrams. Below is SpendWise's design class diagram. 
<img src="https://github.com/isabelle-d/isabelle-d.github.io/blob/29cd429c954149ea0fbc308ef89f821af7a33a08/docs/DCD.drawio%20(5).png">

<b>User Interface (UI):  </b> As seen below, our team chose a light colored theme with beige as a secondary color. This theming is consistent throughout all activities. Each title uses bold lettering and a android cardview background. Initally our team each did our own part and then one team member went in and made each section more consistent. This allowed us to work without worrying too much about the UI yet also letting us keep a consistent theme. 

The first step is to <b>login</b>. There is also a create account screen, each with input verification so you can't input invalid fields. The logins are stored in firebase and verify that each user can only log in to their own account. And then there is the <b>Dashboard</b> which centralizes all the information in one place. There is a pie chart,a  line chart, and bar chart that will always show data because of the seeded information. In the top left corner is the user profile and in the top right corner is the calendar, which a user can edit and the entire app will reflect that date. 
<div class="row">
 <img src="https://raw.githubusercontent.com/isabelle-d/isabelle-d.github.io/e62199eb53404583c5d2512bdf388985c20a29dc/images/png2pdf%20(1)-1.png" width="22%">
  <img src="https://raw.githubusercontent.com/isabelle-d/isabelle-d.github.io/e62199eb53404583c5d2512bdf388985c20a29dc/images/png2pdf%20(2)-1.png" width="22%">
  <img src="https://raw.githubusercontent.com/isabelle-d/isabelle-d.github.io/e62199eb53404583c5d2512bdf388985c20a29dc/images/png2pdf%20(9)-1.png" width="22%">
</div>
The core of the app is the <b>Budget and Expense</b> functionality. Each Budget and Expense has a different frequency, which will be reflected in the UI and functionality. Users can create new budgets with customized categories, and then when creating Expenses the categories of the budgets will be reflected. Expenses will also be subtracted from their respective Budgets. The status of the Budget can be gauged by the color of the title, red is incomplete and overbudget, yellow is incomplete and underbudget, and green is complete and underbudget. Users can click on a Budget that has the period of the budget, a calculator for remaining and spent and total amount, daysLeft until the next period, spent, and amount, and a progress bar for the budget period and other basic information. Users can also delete budgets from this page.  

<div class="row">
  <img src="https://raw.githubusercontent.com/isabelle-d/isabelle-d.github.io/e62199eb53404583c5d2512bdf388985c20a29dc/images/png2pdf%20(7)-1.png" width="22%">
<img src="https://raw.githubusercontent.com/isabelle-d/isabelle-d.github.io/e62199eb53404583c5d2512bdf388985c20a29dc/images/png2pdf%20(8)-1.png" width="22%">
<img src="https://raw.githubusercontent.com/isabelle-d/isabelle-d.github.io/e62199eb53404583c5d2512bdf388985c20a29dc/images/png2pdf%20(4)-1.png" width="22%">

</div>
Then there are the <b>Savings Circle Groups</b>, which are groups users can form with a collaborative goal. Each member can contribute to the goal. Only the leader can delete their group, but anyone can create their own SavingsCircle. Similarly to Budgets and Expenses each savings circle has its own frequency, which is reflected in the period. The leader can invite other users who can accept the invitation and join the group which is updated in sync. 
<div class="row">
 <img src="https://raw.githubusercontent.com/isabelle-d/isabelle-d.github.io/e62199eb53404583c5d2512bdf388985c20a29dc/images/png2pdf%20(6)-1.png" width="22%">
<img src="https://raw.githubusercontent.com/isabelle-d/isabelle-d.github.io/e62199eb53404583c5d2512bdf388985c20a29dc/images/png2pdf%20(5)-1.png" width="22%">

</div>
Lastly, this is the <b>Chatbot</b> screen. Users can interact with the chatbot, talk to it, ask it questions, and ask for insight into their unique data. In the example below, the chatbot pulls data from Spendwise to tell the user where they have overspent and some ways to fix it. The AI has memory from the current conversation, and the user can pick what chat to import memory from at the beginning of their chat in a pop up.
   <img src="https://raw.githubusercontent.com/isabelle-d/isabelle-d.github.io/e62199eb53404583c5d2512bdf388985c20a29dc/images/png2pdf%20(3)-1.png" width="22%">

  

<b>Functionality:</b> A video demonstrating the SpendWise app functionality is below: 


<b>Conclusions and Reflections:</b> Building SpendWise was the most hands-on project I’ve completed so far, and it pushed me to grow in both technical skills and teamwork. My main contributions centered around the budgeting feature, where I implemented UI components, integrated ViewModel logic, and separated it from the View classes. This pushed me to learn more about MVVM architecture and the positive effects it has on implementation. One of the biggest challenges was structuring the app so that multiple features—budgets, expenses, savings circles, and the chatbot—could work independently while still being connected, with low coupling and high cohesion. Solving this forced me to think more carefully about responsibilities and how to build classes that scale as a project grows. 

Working with a team also taught me how to communicate better around version control, divide tasks realistically, and review code with a shared standard. On the technical side, I strengthened my understanding of MVVM, lifecycle-aware components, and how to build UI that updates cleanly with the Observer pattern and built in Android Studio functions. I also learned that good architecture matters, not just for a grade, but for keeping a project maintainable as features evolve.

Overall, this project helped me gain confidence in Android development and reinforced how important good communication, planning, and design principles are for building a real app. SpendWise was a challenging project, but it has given me experience I can continue building on in future apps.

<b>Contributors: </b> 
Isabelle Darling
Ethan Zhang
Alexis Andrulonis
Jayden Bastien 
Murtaza Naidir
Acknowledge all team members who contributed to the app's
development. Specifically, highlight those who were instrumental in the website's
deployment
