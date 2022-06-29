<script lang="ts">
    import {Tile, Content} from 'carbon-components-svelte';

    import {Networking_03, CodeSyntax, HardDrive} from "carbon-pictograms-svelte";

</script>

<div class="dashboard-content">

    <section class="dashboard-header">
        <Tile>
            <h1>Your Dashboard</h1>
        </Tile>
    </section>

    <section class="dashboard-info-sections">

        <div class="section">
            <Tile>
                <h4>API Gateway Resources</h4>
                <Networking_03/>
            </Tile>
    
        </div>


        <div class="section">
            <Tile>
                <h4>Functions</h4>

                <CodeSyntax />
         
            </Tile>
        </div>


        <div class="section">
            <Tile class="tile">
                <h4>Database Instances</h4>

                <HardDrive />
            </Tile>
        </div>

    </section>




</div>



<style lang="scss">

    .dashboard-content{
        display: flex;
        flex-direction: column;
        gap: 25px;

        .dashboard-info-sections{
            display: flex;
            justify-content: space-between;
            
            .section{
                flex: 0.30;
            }
    
        }

    }


</style>